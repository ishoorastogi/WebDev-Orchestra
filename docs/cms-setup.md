# Director CMS setup

The public site continues to run without Supabase and uses the existing pages and local event JSON. The CMS requires a Supabase project; it does not use browser storage as a replacement database.

## Configure Supabase

1. Create a Supabase project and copy its project URL and **publishable** key from Project Settings → API Keys.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and (for deployed sites) `NEXT_PUBLIC_SITE_URL`.
3. Apply `supabase/migrations/202611260001_cms_foundation.sql` using the Supabase CLI (`supabase link`, then `supabase db push`) or the Supabase SQL editor. Treat the SQL migration as the canonical schema source.
4. In Supabase Auth, enable email/password sign-in, turn off public sign-ups, configure email delivery and the allowed redirect URL `/auth/callback`, and use the built-in password reset email flow.
5. Create the director user privately in Supabase Auth. In the Supabase SQL editor, add that exact Auth user to the allowlist (the SQL editor runs with database-owner privileges):

   ```sql
   insert into public.director_admins (user_id)
   select id from auth.users where lower(email) = lower('DIRECTOR_EMAIL_HERE')
   on conflict (user_id) do nothing;
   ```

6. Run `npm run dev`, open `/login`, sign in with the provisioned account, and make a test change in `/admin`. The first save creates the private working draft.

## Key handling

- `NEXT_PUBLIC_SUPABASE_URL` identifies the project and is public.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is designed for browser use. Database grants and RLS still enforce access.
- Do not put a Supabase secret or `service_role` key in this project’s environment. The app uses the signed-in user's cookie session; database writes are protected by server authorization and RLS.
- `.env.local` is ignored by Git. Never commit real credentials.

## Director workflow

- `/admin` edits the draft. Select a page, click a section in its preview, and use the editor panel to change its fields. Sections can be added, removed, and moved. Events, navigation, and footer information are edited in the same draft.
- Changes autosave after a short pause. A save failure is shown with a retry action. Navigating away with pending changes triggers the browser warning.
- `/admin/preview` previews all draft pages behind the director login.
- **Publish changes** validates the draft, confirms the global publish, then calls a Postgres function that inserts an immutable snapshot and advances the active revision pointer in one transaction.
- `/admin/history` lists published revisions. Restoring one copies it into the draft; it does not alter or republish history.
- `/api/events` serves only published events after the first publication. Before Supabase is configured or a first revision exists, it uses the original `data/events.json` file.
- Uploaded files are limited to 10 MB and to JPEG, PNG, WebP, AVIF, or PDF. They remain in a private bucket until a published revision refers to them.

The site has no public sign-up, and administrative pages and write APIs verify Auth and `director_admins` membership on the server. The database migration enables RLS on CMS tables and Storage objects.
