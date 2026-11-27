# Durham Middle School Orchestra Website

React + Vite + React Router. Maroon/white style based on your Figma design.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Edit content
Shared content, links, and lists live in `src/data/site.js`. Page-specific copy is in `src/pages/`. Replace anything in [brackets].
Set `BOOSTER_URL` and `DIRECTOR_EMAIL` there first.

## Add files
- `public/forms/*.pdf` for the UIL documents (update `DOCUMENTS` in `site.js`)
- Photos: import or put them in `public/photos/` and pass `src` to `<Photo />`

## Orchestra handbook

Open `/handbook` from **Resources → Handbook** in the navbar, the home page quick links, or the footer.

- Edit the page labels and highlight questions and answers in `HANDBOOK` in `src/data/site.js`.
- Replace `public/forms/handbook-en.pdf` and `public/forms/handbook-es.pdf` with the official English and Spanish PDFs. Keep the filenames the same and rebuild the site to publish them. The existing view and download links will work without application code changes.
- To add more Resources links, add `{ label: "Link text", to: "/path" }` entries to the Resources item's `children` in `NAV` in `src/data/site.js`. Register new page routes in `src/App.jsx`.

## Notes
- The EN/ES toggle uses Spanish translations in `src/i18n/spanish.js`. When editing English copy, update the corresponding Spanish entry. New text displays in English until a Spanish translation is added.
- `<Photo />` blocks right-click and dragging, which only deters casual saving.
- When hosting, set the host to serve `index.html` for all routes (single-page app rewrite).
