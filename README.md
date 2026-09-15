# MAS Egypt

Three page site for MAS Egypt and its two brands, sharing one design system.

- `/` MAS Egypt, the parent group. Hero, About Us, the split into two brands, Contact Us with a form.
- `/aroma` Aroma Lounge
- `/covy` COVY

React 18 + TypeScript + Vite + Tailwind CSS.

## Running it

This is a Vite app, not a static HTML file. Opening `index.html` directly in a
browser will not work. Serve it:

```bash
npm install
npm run dev
```

Then open the `localhost` address it prints, usually http://localhost:5173.

For a production build:

```bash
npm run build
npm run preview
```

## Two things to fill in before launch

**1. The contact form.** Open `src/config.ts` and paste your Formspree endpoint:

```ts
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Get one free at https://formspree.io. Until it is set, the form still validates
and shows its success state, and logs the payload it would have sent to the
browser console.

**2. Contact details.** Also in `src/config.ts`, `CONTACT_DETAILS` holds
placeholder email, phone and address that appear in the footer of all three
pages. Replace them.

The body copy across all three pages is written to be replaced. It is
positioning language, not facts about the business, and nothing in it states a
figure that would need checking.

## How it is put together

Everything lives in `src/brands.ts`. That one file holds three token sets, one
per brand: colours, cup palettes, nav items and all copy. The pages are the
same components with different tokens, so a change to a shared component lands
on all three pages at once.

```
src/
  brands.ts              three brand configs, colours and copy
  config.ts              Formspree endpoint, contact details, spotlight sizes
  pages/
    Home.tsx             MAS Egypt
    BrandPage.tsx        Aroma and COVY both run through this
  components/
    SpotlightScene.tsx   the cursor reveal, dim layer plus masked lit layer
    CupArt.tsx           the cup, drawn inline as SVG and recoloured per brand
    Hero.tsx  Nav.tsx  About.tsx  Brands.tsx  Contact.tsx
    ContactForm.tsx  Footer.tsx  Reveal.tsx
  hooks/
    useSmoothCursor.ts   eased pointer position
    useHasHover.ts       true on devices with a real pointer
  assets/brand/          the supplied Aroma and COVY lockups
```

### The spotlight

A radial gradient is painted to a canvas each frame and applied to the lit
layer as a CSS mask, so only the circle under the cursor shows the warm
version. `SpotlightScene` takes a `litOverlay`, which is how the brand logos on
the home page fade from a reversed white mark to their real colours as the
light crosses them. Both states use an identical box so nothing doubles at the
edge of the light.

Touch devices never get a hover state, so the brand panels render their lit
version outright rather than sitting dim forever.

### The cup

`CupArt` is inline SVG rather than an image file. It recolours from tokens, so
all three brands share one drawing instead of shipping six near identical
pictures, and it sidesteps a Vite quirk where small SVG imports are inlined as
percent encoded data URIs without escaping parentheses, which breaks the outer
CSS `url()` wrapper.

Each instance needs a unique `idPrefix`. Gradient ids are global to the
document.

### The logos

`src/assets/brand/` holds the supplied Aroma Lounge and COVY lockups, used as
drawn and never recoloured. On the dark pages they are reversed to white, the
way a brand's own dark background version would be. Their real colours appear
on the light plate in each About section and in the brand panels on the home
page when the spotlight crosses them.

`covy-mark.png` is the COVY monogram with the navy plate keyed out, so it can
sit on any background.

## Deploying

`npm run build` outputs to `dist/`. Because the site uses client side routing,
the host needs to serve `index.html` for unknown paths, otherwise a direct hit
on `/aroma` will 404. On Netlify add a `_redirects` file containing:

```
/*  /index.html  200
```

On Vercel this works by default.
