/* ================================================================
   merch.js
   Interactive logic for the merch order page.

   What this script handles:
     1. Toggling product rows selected/unselected (.order-item.selected).
     2. Single-select size chips within each .size-chips group.
     3. Multi-select color swatches (.color-chip).
     4. Live order summary — rows + total recompute on any change.
     5. AJAX submission to Formspree, with a human-readable order
        summary in the email body.

   Why event delegation instead of inline onclick:
     The design prototype used onclick="" attributes on every chip.
     That works, but it scatters behavior across the markup and makes
     the HTML harder to read. Here we attach a small number of
     listeners on the parent containers and dispatch by data-attribute
     or class — markup stays declarative, behavior stays in one place.
   ================================================================ */

/* Source of truth for prices and display names. The HTML mirrors
   these values in the visible price badges and order-row names —
   if you change one here, update both places (or wire them up
   to read from data-* attributes later). */
const PRICES = { 'tee': 20, 'acc': 7, 'full': 25 };
const NAMES  = { 'tee': 'Logo Tee', 'acc': 'Accessory Pack', 'full': 'Full Pack' };

// Which items the visitor has selected. Set, not array, so we can
// add/delete by id without dedupe logic.
const selected = new Set();

/* ── ITEM TOGGLE ──────────────────────────────────────────────── */

document.querySelectorAll('.order-item').forEach(item => {
  // Only the header row toggles selection — clicks inside the
  // configurator (size chips, color swatches, the dropdown) should
  // NOT collapse the panel. We listen on the header specifically.
  const header = item.querySelector('.order-item-header');
  if (!header) return;

  header.addEventListener('click', () => {
    const id = item.dataset.itemId;
    if (selected.has(id)) {
      selected.delete(id);
      item.classList.remove('selected');
    } else {
      selected.add(id);
      item.classList.add('selected');
    }
    updateSummary();
  });
});

/* ── SIZE CHIPS (single-select per group) ────────────────────── */

document.querySelectorAll('.size-chips').forEach(group => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.size-chip');
    if (!chip || !group.contains(chip)) return;
    e.stopPropagation();    // don't bubble to .order-item-header

    group.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

/* ── COLOR CHIPS (multi-select) ──────────────────────────────── */

document.querySelectorAll('.color-chips').forEach(group => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.color-chip');
    if (!chip || !group.contains(chip)) return;
    e.stopPropagation();

    chip.classList.toggle('active');
  });
});

/* ── LYRIC DROPDOWN — swallow clicks ─────────────────────────── */

// Without this, clicking the <select> bubbles to the row and
// collapses the configurator before the dropdown can open.
document.querySelectorAll('.lyric-select-wrap').forEach(wrap => {
  wrap.addEventListener('click', (e) => e.stopPropagation());
});

/* ── ORDER SUMMARY ───────────────────────────────────────────── */

function updateSummary() {
  const rows = document.getElementById('summary-rows');
  const totalEl = document.getElementById('summary-total');
  if (!rows || !totalEl) return;

  if (selected.size === 0) {
    rows.innerHTML = '<div class="summary-row dim">No items selected yet</div>';
    totalEl.textContent = '$0';
    return;
  }

  let total = 0;
  let html = '';
  selected.forEach(id => {
    const price = PRICES[id];
    total += price;
    html += `<div class="summary-row"><span>${NAMES[id]}</span><span class="sum-price">$${price}</span></div>`;
  });
  rows.innerHTML = html;
  totalEl.textContent = `$${total}`;
}

/* ── ORDER SUBMISSION ────────────────────────────────────────── */

const form = document.getElementById('order-form');
const toast = document.getElementById('order-toast');
let toastTimer = null;

function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 5000);
}

/*
 * Build a human-readable order summary that gets stuffed into a
 * hidden <textarea> field (#order-details) right before submit.
 * Formspree emails the form fields verbatim, so the inbox version
 * looks like a tidy receipt rather than a JSON dump.
 */
function buildOrderDetails() {
  const lines = [];

  // Pulling the headline from PRICES/NAMES keeps the email body
  // in sync with the maps above — change a price in one place,
  // both the on-page summary and the email reflect it.
  if (selected.has('tee')) {
    const size = document.querySelector('#item-tee .size-chip.active .size-chip-box')?.textContent || '—';
    lines.push(`• ${NAMES.tee} — $${PRICES.tee}`);
    lines.push(`    Size: ${size}`);
  }

  if (selected.has('acc')) {
    const size = document.querySelector('#item-acc .size-chips.bracelet-size .size-chip.active .size-chip-box')?.textContent || '—';
    const colors = [...document.querySelectorAll('#item-acc .color-chip.active .color-chip-label')]
      .map(el => el.textContent).join(', ') || '—';
    const lyric = document.querySelector('#item-acc .lyric-select')?.value || '—';
    lines.push(`• ${NAMES.acc} — $${PRICES.acc}`);
    lines.push(`    Bracelet size: ${size}`);
    lines.push(`    Bracelet color(s): ${colors}`);
    lines.push(`    Lyric: ${lyric || '—'}`);
  }

  if (selected.has('full')) {
    const teeSize = document.querySelector('#item-full .size-chips.shirt-size .size-chip.active .size-chip-box')?.textContent || '—';
    const brSize = document.querySelector('#item-full .size-chips.bracelet-size .size-chip.active .size-chip-box')?.textContent || '—';
    const colors = [...document.querySelectorAll('#item-full .color-chip.active .color-chip-label')]
      .map(el => el.textContent).join(', ') || '—';
    const lyric = document.querySelector('#item-full .lyric-select')?.value || '—';
    lines.push(`• ${NAMES.full} — $${PRICES.full}`);
    lines.push(`    Shirt size: ${teeSize}`);
    lines.push(`    Bracelet size: ${brSize}`);
    lines.push(`    Bracelet color(s): ${colors}`);
    lines.push(`    Lyric: ${lyric || '—'}`);
  }

  const total = [...selected].reduce((sum, id) => sum + PRICES[id], 0);
  lines.push('');
  lines.push(`TOTAL: $${total}`);

  return lines.join('\n');
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selected.size === 0) {
      showToast('Please select at least one item before submitting.', 'error');
      return;
    }

    // Stamp the order details into the hidden textarea so Formspree
    // includes them in the email body. We also send them as form data
    // for the JSON path below.
    const detailsEl = document.getElementById('order-details');
    const details = buildOrderDetails();
    if (detailsEl) detailsEl.value = details;

    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showToast("Order submitted! We'll follow up via email shortly.");
        // Clear selections + form. Configurator selections inside
        // each row are visually "remembered" by their .active class,
        // but we don't bother clearing those — the panels collapse
        // when we strip .selected, so they're invisible anyway.
        selected.clear();
        document.querySelectorAll('.order-item.selected').forEach(el => el.classList.remove('selected'));
        form.reset();
        updateSummary();
      } else {
        const result = await response.json().catch(() => ({}));
        const message = result.errors?.length
          ? result.errors.map(err => err.message).join(' ')
          : 'Something went wrong. Please try again.';
        showToast(message, 'error');
      }
    } catch (err) {
      console.error('Order submit failed:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Submit →';
      }
    }
  });
}
