# Durham Middle School Orchestra Website

React + Vite + React Router. Maroon/white style based on your Figma design.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Edit content
All page text, links, and lists live in `src/data/site.js`. Replace anything in [brackets].
Set `BOOSTER_URL` and `DIRECTOR_EMAIL` there first.

## Add files
- `public/forms/*.pdf` for the UIL documents (update `DOCUMENTS` in `site.js`)
- Photos: import or put them in `public/photos/` and pass `src` to `<Photo />`

## Notes
- The EN/ES toggle uses Google Translate (machine translation).
- `<Photo />` blocks right-click and dragging, which only deters casual saving.
- When hosting, set the host to serve `index.html` for all routes (single-page app rewrite).
