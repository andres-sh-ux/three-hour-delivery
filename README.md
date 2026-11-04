# 3-Hour Delivery prototype

A prototype built with the **sh-components** library (`../sh-components`): the shopping flow as it looks on the live site today, as the base for the 3-Hour Delivery / Early AM proposals.

**View it:** open `docs/index.html`. `docs/` is a self-contained copy (library files bundled under `docs/lib/`), so it works straight from this repo and on GitHub Pages (Settings → Pages → Deploy from branch → `main` / `/docs`).

> Prototype code: review and test before using anything here near production. Copy and numbers are placeholders.

| File | Purpose |
|---|---|
| `pages/*.html` | **Edit these.** One source per page: index (launcher), plp, pdp, cart, shipping, review |
| `*.html` (root) | Generated from `pages/` for local work next to `../sh-components`; not committed. Never edit them |
| `docs/` | Generated self-contained copy for sharing; committed. Never edit it |
| `js/home.js` | Homepage rails (unused; Home moved to `_archive/` because the PLP covers the top nav) |
| `js/plp.js` | PLP grid: 8 products from the live PLP (PEX Tubing for Radiant Heat) |
| `js/cart-data.js` | Cart, Shipping and Review show the PDP product (Bluefin T050-300-OXY, $87.09); summaries recompute from it |
| `js/pdp.js` | PDP breadcrumb → prototype pages |
| `js/flow.js` | Links the pages: logo → PLP, category circles → PLP, product → PDP, cart icon / Add to Cart → Cart, Secure Checkout → Shipping, CONTINUE → Review |
| `sections/plp-head` | PLP header (breadcrumb, title, help block, sort), pasted into `pages/plp.html` |
| `css/project.css` | PLP column layout and the launcher |
| `js/proposals.js`, `css/proposals.css` | Proposals (Chips / Bolt), review panel, banner, product card tooltip |

Home, PLP and PDP pages, `sections/plp-head` and the rail/grid data come from `brand-test` (without its variant switcher).

**Build:** from `~/Code`, run `python3 sh-components/project.py build three-hour-delivery`.
**Update the shareable copy (before each commit):** `python3 sh-components/project.py export three-hour-delivery --out docs` (builds, then refreshes `docs/`).

## Proposals (review panel)
`js/proposals.js` + `css/proposals.css`. A floating **3-Hour review** panel on every page (bottom right) switches:

| Switch | Options | Link param |
|---|---|---|
| Proposal | Chips (chips everywhere except top nav) · Bolt (exec deck MVP; chips only on time slots) | `p=b|a` |
| Cutoff | Before 4PM (3-Hour) · After 4PM (Early AM) | `cut=before|after` |
| Time label | Short (Today by 2PM / Tomorrow by 8AM) · Medium (12PM / 10AM) · Long (11:30AM) | `t=short|mid|long` |
| Chip color | Light · Dark (B only) | `chip=light|dark` |
| Banner (link only) | Off · On (sample, under the header on signed-in pages) | `banner=off|on` |
| PDP icon (link only) | Truck + bolt · 08 · 04b · 05b (combined icons from Figma, PDP Delivery tile only; `assets/icons/truck-bolt-*.svg`) | `icon=truck|08|04b|05b` |

The panel's Page row moves between pages. Settings live in the link and carry across pages, so the address bar link shares the exact view. `index.html` has preset links.
A selected fastest time slot always shows the dark green badge.
Bolt (`p=a`): plain bolt + "3-Hour" / "Early AM" ("… Delivery" where the word isn't nearby), chips only on time slots (light).
Chips (`p=b`): the same marks as chips everywhere except the top bar, which always shows the plain bolt + text ( product card, PDP tile, Total Available, cart, checkout), light or dark.
Surfaces: header top bar + Delivery flyout, PLP card (+ hover tooltip), PDP tiles + See Time Slots + Total Available, cart, checkout Shipping + Review.

## Proposal hooks (library)
- PDP: `pdp-buy-box` Delivery tile + same-day badge, `delivery-slots-modal` badge.
- PLP / Home: `product-card` promise line.
- Cart: `[data-sh-cart="mark"]` next to "Delivery" in `cart-shipment` (hidden, empty).
- Checkout: `[data-sh-co="badge"]` on the fastest time slot, `[data-sh-co="mark"]` next to "Delivery" in `checkout-shipping-method`.

> Prototype code. Review and test before it goes anywhere near production.
