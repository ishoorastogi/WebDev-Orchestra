# Durham Orchestra calendar service

Use Java 21 and Maven. Enable the Google Calendar API in the Google Cloud
project that owns the key. Inject these environment variables into the backend
process through your local environment or hosting secret manager.

| Variable | Value |
| --- | --- |
| `GOOGLE_CALENDAR_ID` | The directors' public calendar ID from Google Calendar settings |
| `GOOGLE_CALENDAR_API_KEY` | A server-side key restricted to the Google Calendar API |

From this folder, run `mvn test` and `mvn spring-boot:run`. The backend
listens on `127.0.0.1:8080`. Run `npm run dev` from the repo root and open
`/calendar`. Vite proxies `/api/calendar` to the backend. To use a different
development backend address, set `CALENDAR_BACKEND_URL` for Vite.

`GET /api/calendar/events?start=2026-11-01&end=2026-12-13` takes Central
calendar dates with an inclusive start and exclusive end, up to 42 days apart.
It returns event details and inclusive display dates for the grid. Timed
events include UTC instants, which the browser displays in Central time.

For production, build the service with `mvn package` and run the resulting jar
with Java 21. Configure the site's host to route `/api/calendar` to the
service on the same origin as the frontend. Keep the backend credentials in
the service environment.

If the directors' calendar is private, going live requires director-approved,
authorized read-only access. The API key supports public calendar data only.

The integration tests use a loopback Google API fixture. For manual fixture
testing, the backend's `GOOGLE_CALENDAR_BASE_URL` can point to that fixture
with dummy credentials.
