# Yuri Carnino — portfolio

A four-page portfolio site. Plain HTML, CSS, and JavaScript: no framework, no build step, no dependencies at runtime. The home page is a zoomable map of where the work happened.

## Structure

```
portfolio/
├── index.html          Home: name, hook, map, selected work, recommendations
├── projects.html       Case studies (problem, role, action, result) with filters
├── about.html          Bio, strengths, experience timeline, skills
├── contact.html        Email, LinkedIn, GitHub, message form
├── css/
│   └── styles.css      All styling. Color and type tokens are at the top.
├── js/
│   ├── content.js      EDIT THIS: profile links, every project, recommendations
│   ├── site.js         Theme toggle, page rendering, filters, form, hover tilt
│   ├── map.js          Map views, pins, zoom animation, side panel
│   └── map-data.js     Generated map shapes. Do not edit by hand.
├── assets/
│   └── favicon.svg
├── tools/              Only needed if you want to regenerate the map shapes
│   ├── build-map.mjs
│   └── package.json
├── WIREFRAME.md        Section-by-section layout of every page
├── .nojekyll           Tells GitHub Pages to serve the files as they are
└── README.md
```

## Before you publish

Open `js/content.js` and:

1. Paste your LinkedIn and GitHub URLs into `profile.linkedin` and `profile.github`. Until you do, the contact page shows a reminder instead of a link.
2. Replace the three recommendation slots in `testimonials` with real quotes and set `draft: false`, or delete the entries. Draft slots are visible on the home page.
3. Read every project once. The numbers come from your resume, poster, and paper. Check that employers are fine with the level of detail, especially current work.

Then open `about.html` and rewrite the first paragraph (the Brazil line) in your own words.

## Run it locally

Double-click `index.html`. Everything works from the file system.

If you prefer a local server:

```bash
cd portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

A site at `https://YOUR-USERNAME.github.io`:

1. On GitHub, create a new public repository named exactly `YOUR-USERNAME.github.io`.
2. In a terminal, from inside this folder:

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```

3. On GitHub, open the repository, then Settings → Pages. Under "Build and deployment", set Source to "Deploy from a branch", Branch to `main` and folder `/ (root)`. Save.
4. Wait a minute or two and open `https://YOUR-USERNAME.github.io`.

No terminal? Create the repository, click "uploading an existing file", drag in everything inside this folder (including `.nojekyll`), commit, then do step 3.

To update the site later, edit files and run `git add . && git commit -m "Update" && git push`.

## Make the contact form send email

GitHub Pages cannot receive form posts. Out of the box, "Send message" opens the visitor's email app with the message filled in.

To have messages delivered without that step, create a free form at a service such as Formspree, copy its endpoint URL, and paste it into `profile.formEndpoint` in `js/content.js`. The form then posts there and confirms on the page.

## Common edits

| To change | Edit |
| --- | --- |
| A project's text or numbers | The matching entry in `js/content.js` |
| Which four projects are on the home page | `featured: true` in `js/content.js` |
| The accent color | `--accent` and `--accent-ink` at the top of `css/styles.css` (both themes) |
| Fonts | The Google Fonts `<link>` in each HTML file and `--display` / `--body` in `css/styles.css` |
| Hero text | `index.html`, the `hero` section |
| Bio, timeline, skills | `about.html` |

### Add a project

Copy an entry in the `projects` array in `js/content.js`, give it a new `id`, and set `place` to one of `annarbor`, `saline`, `milwaukee`, `sansebastian`. It appears on the projects page and in the map panel for that place.

### Add a place to the map

In `js/map.js`:

1. Add a view to `VIEWS` with `bounds: [west, south, east, north]` in degrees and a `parent`.
2. Add a pin to `PINS` with its longitude and latitude.
3. Add a function to `PANELS` for the side panel text, and a `placeBtn(...)` line in the parent's panel.
4. To highlight the country or state on the parent view, add its ID to the parent's `hot` map (ISO numeric code for countries, FIPS code for US states).

Use the new place name as `place` on projects in `js/content.js`.

### Regenerate the map shapes

Only needed if you change how much geographic detail is included.

```bash
cd tools
npm install
npm run build
```

## How the map works

`js/map-data.js` holds country, US state, and Michigan county outlines already projected to Web Mercator as SVG paths. `js/map.js` draws them once and animates the SVG `viewBox` between views. Pins are real buttons positioned over the map, so the whole thing works with a keyboard and a screen reader, and the list beside the map does everything the map does.

Views: `world` → `usa` → `michigan` (Ann Arbor and Saline) or `wisconsin` (Milwaukee); `world` → `spain` (San Sebastián); `world` → `brazil`, which zooms and then opens the About page. `index.html#michigan` links straight to a view.

## Accessibility and performance

- Works at phone width; nothing scrolls sideways.
- Every control is reachable by keyboard with a visible focus ring. Escape steps the map back out.
- Animation is turned off for visitors who ask for reduced motion.
- Dark by default, with a light theme on the toggle.
- About 70 KB of map data after compression; no images, no libraries.

## Credits

Map shapes: Natural Earth (via world-atlas) and the US Census Bureau (via us-atlas), both public domain. Fonts: Archivo, Schibsted Grotesk, JetBrains Mono (SIL Open Font License, served by Google Fonts).
