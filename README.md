# Durham Middle School Orchestra Website

The website uses Next.js App Router, React, and TypeScript. Frontend content and reusable JSX components live in `src/`; route entry points live in `app/`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` to create a production build and `npm start` to serve it.

## Routes

- `/` — Home
- `/directors`
- `/new-to-orchestra`
- `/getting-an-instrument`
- `/returning-members`
- `/uil`
- `/api/events` — event data from `data/events.json`

## Site content

Page copy, navigation, and editable lists are in `src/data/site.js`. Event records are in `data/events.json`; update that file to change the events returned by the API. Place public documents and photos under `public/` and reference them by URL.

## Director CMS

The director editing area is available at `/login`; after signing in, open `/admin` to edit page content, events, navigation, and footer settings. Drafts are saved in Supabase and published revisions are served on the public site.

To connect Supabase, copy `.env.example` to `.env.local`, set the public Supabase URL and publishable key, then apply the SQL migration in `supabase/migrations/`. Follow [the CMS setup guide](docs/cms-setup.md) to configure the database, storage bucket, and director account. Without Supabase configuration, the public site uses its built-in content and admin APIs remain unavailable.
