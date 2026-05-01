/* ================================================================
   contact.js
   AJAX submission for the booking form.

   Why this file exists:
     The default Formspree integration (just `action="..."` on the
     <form>) navigates the visitor to a Formspree-hosted thank-you
     page after they hit Send. This script replaces that with an
     in-page toast confirmation, so users never leave the site.

   How it works:
     1. Intercept the form's submit event.
     2. POST the form data to Formspree's endpoint as JSON
        (the Accept header is what tells Formspree to respond
        with JSON instead of redirecting).
     3. On success → reset the form + show a success toast.
     4. On failure → show an error toast with whatever Formspree
        reported (e.g. invalid email, hit the rate limit, etc.).

   The toast itself is a fixed-position element in the HTML
   (#contact-toast); CSS lives in contact.css.
   ================================================================ */

const form = document.getElementById('contact-form');
const toast = document.getElementById('contact-toast');

// Auto-dismiss timer — cleared whenever a new toast fires so that
// rapid submissions don't fight over the timeout.
let toastTimer = null;

function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.type = type;            // styling hook: [data-type="error"] swaps the border red
  toast.classList.add('visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const submitBtn = form.querySelector('.form-submit');

    // Disable the button while in-flight so a jumpy user can't
    // fire three submits and trigger Formspree's rate limit.
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showToast("Thanks — we'll be in touch.");
      } else {
        // Formspree returns { errors: [{ message: "..." }] } on validation failures.
        const result = await response.json().catch(() => ({}));
        const message = result.errors?.length
          ? result.errors.map(err => err.message).join(' ')
          : 'Something went wrong. Please try again.';
        showToast(message, 'error');
      }
    } catch (err) {
      // Network-level failure (offline, DNS, etc.) — fetch() rejects.
      console.error('Contact form submit failed:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Send';
      }
    }
  });
}
