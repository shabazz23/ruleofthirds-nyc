# Golden Hour Loft — ruleofthirds.nyc

A light editorial one-page site for **Golden Hour Loft**, a 5,000 sq ft Brooklyn
production space under the **Rule of Thirds** umbrella.

Static site — no build step, no dependencies. Just HTML, CSS, and vanilla JS.

## Structure

- `index.html` — page content and structure
- `styles.css` — light editorial design system
- `script.js` — sticky header, mobile menu, scroll reveals
- `images/` — optimized photos (`*-sm.jpg` variants are used for mobile via `srcset`)
- `tools/optimize_images.py` — the script used to select & compress the photos

## Deploy (GitHub + Vercel)

1. Create a new GitHub repo (e.g. `ruleofthirds-nyc`) and push this folder's contents.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Other**.
   No build command, no output directory — Vercel serves it as a static site.
3. Add the custom domain `ruleofthirds.nyc` in the project settings and add the
   DNS records Vercel gives you at your registrar.

## Editing content

- Copy lives in `index.html`, clearly sectioned (hero, spaces, about, details, booking, footer).
- Booking buttons point at the Peerspace listing — search `peerspace.com` in
  `index.html` to update the URL in one pass.
- To swap a photo: drop the new file in `images/` and update the `src`/`srcset`
  on the relevant `<img>` tag.
