# Deploy the orchestra calendar on Supabase

The Supabase Edge Function serves the same event data as the Java calendar service. The website's Calendar tab stays at `/calendar`. Visitors can read the designated public orchestra calendar without signing in.

## One-time setup

1. In your team's Supabase project, open **Edge Functions → Secrets**. Add `GOOGLE_CALENDAR_ID` and `GOOGLE_CALENDAR_API_KEY`. Use a school-managed key enabled and restricted to Google Calendar API. Use a calendar intended for public display, with sharing set to **See all event details**. Entries marked private or confidential are omitted.
2. From the repository root, deploy with an authenticated Supabase CLI. Replace `YOUR_PROJECT_REF` with the project reference in the Supabase dashboard.
   ```sh
   supabase functions deploy calendar-events --project-ref YOUR_PROJECT_REF --no-verify-jwt
   ```
   The public function accepts read-only requests for the configured calendar. The Google key is sent only to Google and is kept out of the browser.
3. In the frontend host's build environment, set `VITE_SUPABASE_URL` to the project's HTTPS URL, for example `https://YOUR_PROJECT_REF.supabase.co`. Build and deploy the Vite app again. The project URL is safe to expose. Do not set any `VITE_` variable containing the Google API key.
4. Open the website's **Calendar** tab, find a known event, and open its details. An event edit may take up to 30 seconds to appear after refreshing.

With `VITE_SUPABASE_URL` set, the website reads calendar events from Supabase. For the original local Java demo, leave it unset and run Vite and Spring Boot as documented in [the Java backend setup](../calendar-backend/README.md).

For local function tests with Deno:

```sh
deno test --node-modules-dir=none --no-lock supabase/functions/calendar-events
```
