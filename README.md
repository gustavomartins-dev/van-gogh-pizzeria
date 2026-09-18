# Van-Gogh Pizzeria

An independent restaurant website concept for Van Gogh in Santos, Brazil. One continuous oil-painted landscape connects a starry sky, small pizza-shaped stars, and a sunflower field as visitors scroll.

## Experience

- Full-bleed artwork, without a decorative frame.
- Subtle WebGL wind distortion across the sky and flowers; readable text stays still.
- Responsive navigation, official ordering links, restaurant information and contact details.
- Animation pause control, reduced-motion support, keyboard focus states and a static-image fallback when WebGL is unavailable.
- Animation stops while the browser tab is hidden or the painted section is out of view.

## Implementation

React 19, TypeScript, Vinext, Tailwind CSS and a lightweight custom WebGL shader. The canvas uses a capped device-pixel ratio to balance clarity and rendering cost. There is no checkout, payment collection or invented menu pricing: ordering and current prices belong to the official restaurant service.

The AI-generated landscape is delivered as lossless WebP. Its native resolution is **1024 × 1536**, not 4K; large displays can still reveal the source-resolution limit. Increasing canvas resolution does not create additional image detail.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The local site runs at http://localhost:5173. Run `npx tsc --noEmit` for type checking and `npm run build` for a production build.

## Content and attribution

Restaurant information is based on the [official website](https://www.vangoghpizza.com.br/) and [official ordering service](https://deliverydireto.com.br/vangogh/vangogh/pages/sobre-nos), consulted on September 18, 2026. Descriptions are summarized; this is not an exact copy of every menu page. Visitors should confirm prices, availability and hours with the restaurant.

The landscape is AI-generated artwork inspired by Vincent van Gogh's painterly language, not a photograph or an original painting by the artist. This independent portfolio concept is not an official restaurant website or an endorsement.

## Verification

Type checking and production build; browser checks of desktop/mobile layouts, section navigation, mobile menu, animation readiness and pause/resume. Physical-device performance and reduced-motion behavior still merit device-level testing before a commercial launch.
