# MAS Egypt

Three page site for MAS Egypt and its brands, sharing one design system.

- `/` MAS Egypt, the parent group. Hero, About, owned brands, venue management, locations, contact.
- `/aroma` Aroma Lounge. Runs light, with menu, desks, branches, reservations and Instagram.
- `/covy` COVY.

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

## Fill these in before launch

Everything that needs real data is a clearly marked placeholder.

**1. Contact form.** `src/config.ts`, paste your Formspree endpoint:

```ts
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Free account at https://formspree.io. Until it is set, the form still
validates and shows its success state, and logs the payload to the console.

**2. Group contact details.** `src/config.ts`, `CONTACT_DETAILS`. Email, phone
and address in the footer of all three pages.

**3. Instagram handles.** `src/config.ts`, `SOCIAL`, and the `instagram` field
on each brand in `src/brands.ts`. Put the handle in without the @. Leave it
empty and every Instagram link hides itself rather than pointing nowhere.

**4. Branch details.** `src/branches.ts`. Addresses, opening hours, phone
numbers and WhatsApp numbers are placeholders. Areas, price ranges and Google
ratings are real, taken from the live listings. Ratings go stale, so refresh
them when you update the site, or delete `rating` and `reviews` from a branch
and that row disappears from the card.

**5. Menu.** `src/menu.ts` is REAL DATA, pulled from the live digital menu on
15 September 2026. 196 items across Food, Drinks, Breakfast, Dessert and Kids,
with published EGP prices. Re-check it whenever the kitchen changes prices.

The source menu also carries an Arabic description for most dishes, which is
not in here yet and is the obvious starting point for an Arabic version.

Shisha is served on the terrace but is not on the digital menu, so there is no
shisha section rather than invented prices. Send them over and it takes ten
minutes to add.

**6. Instagram images.** `src/components/InstagramGrid.tsx`, the `IMAGES`
array. Add nine image paths and the on brand placeholder tiles are replaced. A
live feed needs the Instagram API or a paid widget, both of which bring a
token that expires, so nine hand picked images is the cheaper honest version.

**7. Managed venue roster.** `src/brands.ts`, the `MANAGEMENT` block. Set
`showRoster` to true and add clients once they are cleared to be named. Until
then the section shows capabilities and a line saying the list is available on
request, rather than inventing logos.

Body copy across all three pages is positioning language, written to be
replaced. Nothing in it states a figure about the business that would need
checking.

## How it is put together

`src/brands.ts` holds three token sets, one per brand: surface colours, cup
palettes, nav items and all copy. The pages are the same components with
different tokens.

MAS and COVY are dark. Aroma is the daytime brand so it runs light, which is
why every shared component reads its colours from `brand.ui` rather than
hardcoding white. Same type, same motion, inverted surface.

```
src/
  brands.ts              three brand configs, colours, ui tokens and copy
  branches.ts            branch data, maps links, WhatsApp links, open-now logic
  menu.ts                Aroma menu by category
  config.ts              Formspree, contact details, socials, reservation setup
  pages/
    Home.tsx             MAS Egypt
    AromaPage.tsx        Aroma, light theme and its own structure
    BrandPage.tsx        COVY
  components/
    SpotlightScene.tsx   cursor reveal, dim layer plus masked lit layer
    CupArt.tsx           the cup, inline SVG, recoloured per brand
    ScrollShowcase.tsx   pinned product with feature pills on scroll
    ProductArt.tsx       the cup and feteer for the showcase
    MapPanel.tsx         stylised locator with clickable pins
    Branches.tsx         branch cards, open-now badge, maps and WhatsApp
    Reservation.tsx      five step booking mockup
    MenuExplorer.tsx     filterable menu
    Desks.tsx            work desks section
    Management.tsx       venues MAS runs for other owners
    Locations.tsx        compact footprint strip on the group page
    InstagramGrid.tsx    nine tiles linking to the profile
    Hero.tsx  AromaHero.tsx  Nav.tsx  About.tsx  Brands.tsx
    Contact.tsx  ContactForm.tsx  Footer.tsx  Reveal.tsx
  hooks/
    useSmoothCursor.ts   eased pointer position
    useHasHover.ts       true on devices with a real pointer
  assets/brand/          the supplied Aroma and COVY lockups
```

### The spotlight

On the dark pages a radial gradient is painted to a canvas each frame and
applied to the lit layer as a CSS mask, so only the circle under the cursor
shows the warm version. `SpotlightScene` takes a `litOverlay`, which is how the
brand logos on the group page fade from a reversed white mark to their real
colours as the light crosses them. Both states use an identical box so nothing
doubles at the edge of the light.

Touch devices never get a hover state, so the brand panels render their lit
version outright rather than sitting dim forever.

### The scroll showcase

Aroma's two product sections pin the product in a sticky viewport while the
section scrolls past, and the feature pills fly in as scroll progress passes
each threshold. The track is three viewport heights, so the usable range is
the track minus one viewport.

### The cup

`CupArt` is inline SVG rather than an image file. It recolours from tokens, so
all three brands share one drawing, and it sidesteps a Vite quirk where small
SVG imports are inlined as percent encoded data URIs without escaping
parentheses, which breaks the outer CSS `url()` wrapper.

Each instance needs a unique `idPrefix`. Gradient ids are global to the
document.

### The map

`MapPanel` is a stylised locator, not a survey map. Pin positions are relative
so Madinaty reads north east of Mivida, but nothing is to scale. Real
navigation is the "Open in Maps" button, which deep links to the live listing.

If you want a draggable map, Mapbox styles cleanly to either palette and takes
a free key. Google's basic embed needs no key but brings its own look.

### The reservation

Front end mockup. Nothing is stored. It collects branch, date, time, party
size, seating and details, shows a confirmation with a reference code, then
hands off to WhatsApp with the booking prefilled, which is how a table
actually gets confirmed here. Some time slots show as busy, generated
deterministically from the date so they do not reshuffle on every render.

To make it real, replace `handleSubmit` in `src/components/Reservation.tsx`.

### The logos

`src/assets/brand/` holds the supplied Aroma Lounge and COVY lockups, used as
drawn and never recoloured. On the dark pages they are reversed to white, the
way a brand's own dark background version would be. Aroma's page is light, so
there the lockup keeps its real colours throughout.

`covy-mark.png` is the COVY monogram with the navy plate keyed out.

## Deploying

`npm run build` outputs to `dist/`. Client side routing means the host must
serve `index.html` for unknown paths, otherwise a direct hit on `/aroma` will
404. A `_redirects` file for Netlify is already in `public/`. Vercel handles
this by default.
