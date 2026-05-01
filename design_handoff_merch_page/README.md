# Handoff: Merch Order Page

## Overview
This package contains the hi-fi design reference for a band website's **Merch Order Page** (`Merch Page.html`). The page allows fans to browse three merch items, configure their order (including a custom lyric bracelet), fill out their shipping info, and submit an order request. A reference to the main band website (`Band Website.html`) is also included for visual/style context.

## About the Design Files
The HTML files in this bundle are **design references created as prototypes** — they show the intended look, layout, and interactive behavior, but are **not production code to copy directly**. Your task is to **recreate these designs in your target codebase** using its established framework, component libraries, and patterns (e.g. React, Next.js, Vue, etc.). If no framework exists yet, choose the most appropriate one and implement accordingly.

## Fidelity
**High-fidelity.** The mockups contain final colors, typography, spacing, hover states, and interactions. Recreate the UI as close to pixel-perfect as your stack allows, using the design tokens listed below.

---

## Screens / Views

### 1. Merch Page (`Merch Page.html`)

#### Top Navigation Bar
- Sticky, `height: 64px`, `background: rgba(10,10,10,0.95)` with `backdrop-filter: blur(12px)`
- Border bottom: `1px solid #1e1e1e`
- Left: Band logo — `font-family: 'Bebas Neue'`, `font-size: 28px`, `letter-spacing: 3px`. The period after the name is `color: #D91C2A`
- Right: Nav links — `font-size: 12px`, `letter-spacing: 2px`, uppercase, `color: #a09a92`. On hover: `color: #f0ede8` + red underline slides in from left
- "Book Us" link is a red pill button: `background: #D91C2A`, `padding: 6px 16px`
- "Merch" link is the active state: `color: #f0ede8` + red underline visible

#### Page Header
- `padding: 64px 48px 48px`
- Small red label: `font-size: 12px`, `letter-spacing: 3px`, uppercase, `color: #D91C2A`, followed by a 40px wide `#333` line
- H1: `font-family: 'Bebas Neue'`, `font-size: clamp(52px, 7vw, 96px)`, `letter-spacing: 2px`, `line-height: 0.9`
- Ghost watermark: "MERCH" in `font-family: 'Bebas Neue'`, `font-size: 200px`, `color: #ffffff04`, positioned absolute right
- Breadcrumb below: `Home › Merch`, `font-size: 11px`, `color: #555`. "Home" links back to main site

#### Product Cards Section
- `padding: 64px 48px`
- Three cards in a CSS grid: `grid-template-columns: repeat(3, 1fr)`, `gap: 2px`
- Each card: `background: #1a1a1a`, hover lifts: `translateY(-3px)`

**Card structure:**
- Photo area: `aspect-ratio: 1`, dark hatched background (placeholder), gradient overlay fading to black at bottom. Photo placeholder label: `font-size: 11px`, `color: #333`
- Optional badge (top-left): `background: #D91C2A`, `font-family: 'Bebas Neue'`, `font-size: 13px`, `letter-spacing: 2px`, `padding: 2px 10px`
- Info area: `padding: 20px 24px 24px`
  - Name: `font-family: 'Bebas Neue'`, `font-size: 28px`, `letter-spacing: 1px`
  - Price: `font-size: 13px`, `color: #D91C2A`, `letter-spacing: 1px`
  - Description: `font-size: 12px`, `line-height: 1.7`, `color: #a09a92`
  - Includes list: each item prefixed by a `4px` red square bullet, `font-size: 11px`, `color: #555`

**The three products:**
| Product | Price | Badge | Includes |
|---|---|---|---|
| Classic Tee | $28 | — | Band graphic front & back · Sizes S–2XL · Black only |
| Accessory Pack | $22 | "Pack" | 1× die-cut vinyl sticker · 1× Custom lyric bracelet · Choose size, color & lyric |
| Full Pack | $44 | "Best Value" | 1× Classic Tee · 1× Sticker · 1× Custom lyric bracelet |

#### Order Form Section
- `padding: 64px 48px 80px`
- Section label + title same style as page header
- Two-column grid: `grid-template-columns: 1fr 1.2fr`, `gap: 64px`

**Left column — Personal Info:**
- Block title: `font-family: 'Bebas Neue'`, `font-size: 22px`, `letter-spacing: 2px`, `border-bottom: 1px solid #333`
- Fields: Name, Email, Phone, Street Address, Apt/Unit, then a 3-col row for City / State / ZIP
- Each field: label in `font-size: 10px`, `letter-spacing: 3px`, uppercase, `color: #D91C2A`. Input underline-only style: `border-bottom: 1px solid #2a2a2a`, transparent background, `font-family: 'Space Mono'`, `font-size: 13px`. On focus: `border-color: #D91C2A`

**Right column — Item Selector:**
- Block title: same style as left
- Three stacked item rows, each: `background: #1a1a1a`, `border: 1px solid #1e1e1e`
- Left accent bar: `3px`, `background: #D91C2A`, revealed with a `scaleY` animation when the item is selected
- Each row contains: checkbox square → product thumbnail (52×52px dark placeholder) → name + subtitle → price
- **Clicking a row toggles selection.** When selected: checkbox fills red with a white checkmark SVG; the config panel expands below with `display: flex` (hidden when unselected)

**Bracelet Configurator (expands inside Accessory Pack and Full Pack rows):**

1. **Bracelet Size picker** — chips with inner diameter guide:
   - XS = 1.75" · S = 2.0" · M = 2.25" · L = 2.5"
   - Each chip: `border: 1px solid #333`, `font-size: 12px`. Active state: `border-color: #f0ede8`, `background: #222`
   - Size label above, diameter label below in `font-size: 9px`, `color: #555`

2. **Bracelet Color multi-select** — circular swatches (28×28px), `border-radius: 50%`:
   - Red: `#C0392B`
   - White: `#f0ede8`
   - Black: `#1a1a1a`
   - Pink: `#E8A0B0`
   - Active state: `border: 2px solid #f0ede8`, `transform: scale(1.12)`. Checkmark `✓` shown in center. Multiple colors can be active simultaneously.
   - Label below each swatch: `font-size: 10px`, `color: #555`

3. **Lyric dropdown** — full-width `<select>`:
   - `background: #222`, `border: 1px solid #2a2a2a`, `color: #f0ede8`, `font-family: 'Space Mono'`, `font-size: 12px`, `padding: 10px 36px 10px 14px`
   - Custom red caret arrow (`▾`, `color: #D91C2A`) positioned absolute right
   - Options: populate with the band's actual lyric lines (placeholders shown in prototype)
   - On focus: `border-color: #D91C2A`

**Classic Tee config (simpler):** only shows shirt size picker (S / M / L / XL / 2XL), no bracelet options.

**Full Pack config:** shows shirt size picker first, then all bracelet options (size + color + lyric).

#### Order Summary
- Below the item selector, `border-top: 1px solid #1a1a1a`, `padding-top: 32px`
- Summary label: red, 10px uppercase
- Dynamic rows: one per selected item showing name + price in red. When nothing selected: dim text "No items selected yet"
- Total row: `font-family: 'Bebas Neue'`, `font-size: 22px`, `letter-spacing: 2px`, `border-top: 1px solid #222`
- Submit area: left = small note text (`font-size: 10px`, `color: #555`, line-height 1.6); right = Submit button
- Submit button: `background: #D91C2A`, `font-family: 'Bebas Neue'`, `font-size: 22px`, `letter-spacing: 3px`, `padding: 16px 40px`. Hover: `background: #a01420`

---

## Interactions & Behavior

| Interaction | Behavior |
|---|---|
| Click order item row | Toggles selected state; expands/collapses bracelet config |
| Click size chip | Single-select within group (others deselect) |
| Click color swatch | Multi-select toggle (independent per swatch) |
| Lyric dropdown | Standard single-select |
| Order summary | Reactively updates total as items are checked/unchecked |
| Submit with no items | Alert: "Please select at least one item" |
| Submit with items | Confirmation message; hook up to email/form backend |
| Nav links | Smooth scroll or route to relevant page sections |
| Product cards | Hover lifts card `translateY(-3px)` |

### Scroll Reveal Animations
- Elements with `.reveal` class fade in (`opacity 0→1`) and slide up (`translateY 20px→0`) when they enter the viewport
- Duration: `0.6s ease`. Staggered delays: `0.1s`, `0.2s`, `0.3s` for sequential children
- Implemented via `IntersectionObserver` (threshold 0.1)

---

## State Management

```
selectedItems: Set<'tee' | 'acc' | 'full'>
teeSize: 'S' | 'M' | 'L' | 'XL' | '2XL'
accBraceletSize: 'XS' | 'S' | 'M' | 'L'
accBraceletColors: Set<'red' | 'white' | 'black' | 'pink'>
accLyric: string
fullTeeSize: 'S' | 'M' | 'L' | 'XL' | '2XL'
fullBraceletSize: 'XS' | 'S' | 'M' | 'L'
fullBraceletColors: Set<'red' | 'white' | 'black' | 'pink'>
fullLyric: string
orderTotal: number  // derived from selectedItems
```

Form fields (controlled inputs):
```
name, email, phone, street, apt, city, state, zip
```

---

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `--black` | `#0a0a0a` | Page background |
| `--black-2` | `#111111` | Secondary background |
| `--black-3` | `#1a1a1a` | Card backgrounds |
| `--black-4` | `#222222` | Active chip bg, select bg |
| `--white` | `#f0ede8` | Primary text, active states |
| `--white-dim` | `#a09a92` | Secondary text, descriptions |
| `--white-dimmer` | `#555555` | Tertiary text, placeholders |
| `--red` | `#D91C2A` | Accent — CTAs, labels, prices, borders |
| `--red-dark` | `#a01420` | Hover state for red elements |

### Typography
| Role | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Display / Headings | Bebas Neue | clamp(52px–96px) | 400 | 2–3px |
| Section labels | Space Mono | 10–12px | 400 | 3px |
| Body / descriptions | Space Mono | 12–13px | 400 | 0.5px |
| Hand-written (polaroids) | Permanent Marker | 22px | 400 | — |

### Spacing
- Page horizontal padding: `48px`
- Section vertical padding: `64px` top/bottom
- Card grid gap: `2px`
- Form field gap: `24px`
- Order item gap: `2px`

### Borders & Shadows
- Cards: no border-radius (sharp corners throughout)
- Nav: `border-bottom: 1px solid #1e1e1e`
- Form inputs: underline only (`border-bottom: 1px solid #2a2a2a`)
- Order items: `border: 1px solid #1e1e1e`

---

## Assets
- **Band logo PNG**: to be placed in the nav. Prototype shows text placeholder.
- **Product photos**: three images (Tee, Accessory Pack, Full Pack). Prototype shows hatched placeholders.
- **Google Fonts**: `Bebas Neue`, `Space Mono` (400/700/italic), `Permanent Marker` — load from Google Fonts or self-host.

---

## Files in This Package
| File | Purpose |
|---|---|
| `Merch Page.html` | Hi-fi design reference for the merch order page |
| `Band Website.html` | Hi-fi design reference for the main band website (for visual/style context) |
| `README.md` | This document |

---

## Notes for the Developer
- The prototype uses vanilla JS for interactivity. In your framework, translate toggle/select logic into proper state management (React `useState`, Pinia, etc.).
- Form submission currently shows a browser alert — wire it up to a real backend (Formspree, Netlify Forms, a custom API endpoint, etc.) and add proper validation.
- The lyric dropdown options are placeholders — replace with the band's actual lyrics.
- Sharp corners (`border-radius: 0`) are intentional and part of the industrial aesthetic. Do not add rounding.
- The noise texture overlay on `body::before` uses an inline SVG data URI — replicate or substitute with a real noise texture asset if preferred.
