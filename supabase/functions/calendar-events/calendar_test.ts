import assert from "node:assert/strict";
import { createCalendarHandler } from "./calendar.ts";

const config = {
  calendarId: "orchestra+public@example.org",
  apiKey: "test-only-google-key",
};
const endpoint = "http://localhost/functions/v1/calendar-events";
const range = "?start=2026-10-25&end=2026-12-06";

Deno.test("requests the full Central-date range over DST and returns public events across pages", async () => {
  const urls: URL[] = [];
  const handler = createCalendarHandler(config, (input, init) => {
    const url = new URL(String(input));
    const headers = new Headers(init?.headers);
    urls.push(url);
    assert.equal(headers.get("x-goog-api-key"), config.apiKey);
    assert.equal(init?.redirect, "error");
    assert.equal(url.host, "www.googleapis.com");
    assert.equal(
      url.pathname,
      "/calendar/v3/calendars/orchestra%2Bpublic%40example.org/events",
    );
    assert.equal(url.searchParams.get("timeMin"), "2026-10-25T05:00:00.000Z");
    assert.equal(url.searchParams.get("timeMax"), "2026-12-06T06:00:00.000Z");
    assert.equal(url.searchParams.get("singleEvents"), "true");
    assert.ok(!url.href.includes(config.apiKey));

    if (urls.length === 2) {
      assert.equal(url.searchParams.get("pageToken"), "next+page/=");
      return Promise.resolve(Response.json({
        items: [{
          id: "trip",
          summary: "Trip",
          start: { date: "2026-11-20" },
          end: { date: "2026-11-22" },
        }],
      }));
    }

    return Promise.resolve(
      Response.json({
        nextPageToken: "next+page/=",
        items: [
          {
            id: "concert",
            summary: "Concert",
            description: "Bring your music.",
            location: "Auditorium",
            attendees: [{ email: "omitted@example.org" }],
            start: { dateTime: "2026-11-12T23:00:00-06:00" },
            end: { dateTime: "2026-11-13T00:00:00-06:00" },
          },
          {
            id: "private",
            visibility: "private",
            summary: "Private meeting",
            start: { date: "2026-11-13" },
            end: { date: "2026-11-14" },
          },
          {
            id: "cancelled",
            status: "cancelled",
            start: { date: "2026-11-13" },
            end: { date: "2026-11-14" },
          },
        ],
      }),
    );
  });

  const response = await handler(new Request(endpoint + range));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "*");
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=30");
  assert.deepEqual(await response.json(), [{
    id: "concert",
    title: "Concert",
    description: "Bring your music.",
    location: "Auditorium",
    allDay: false,
    firstDate: "2026-11-12",
    lastDate: "2026-11-12",
    startsAt: "2026-11-13T05:00:00.000Z",
    endsAt: "2026-11-13T06:00:00.000Z",
  }, {
    id: "trip",
    title: "Trip",
    description: null,
    location: null,
    allDay: true,
    firstDate: "2026-11-20",
    lastDate: "2026-11-21",
    startsAt: null,
    endsAt: null,
  }]);
  assert.equal(urls.length, 2);
});

Deno.test("uses the offset at midnight on the spring DST transition date", async () => {
  const handler = createCalendarHandler(config, (input) => {
    const { searchParams } = new URL(String(input));
    assert.equal(searchParams.get("timeMin"), "2026-03-08T06:00:00.000Z");
    assert.equal(searchParams.get("timeMax"), "2026-03-09T05:00:00.000Z");
    return Promise.resolve(Response.json({ items: [] }));
  });
  const response = await handler(
    new Request(endpoint + "?start=2026-03-08&end=2026-03-09"),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

Deno.test("rejects invalid ranges and methods without calling Google", async () => {
  let upstreamCalls = 0;
  const handler = createCalendarHandler(config, () => {
    upstreamCalls += 1;
    return Promise.resolve(Response.json({ items: [] }));
  });

  for (
    const query of [
      "",
      "?start=2026-11-31&end=2026-12-06",
      "?start=2026-11-12&end=2026-11-12",
      "?start=2026-10-25&end=2026-12-07",
    ]
  ) {
    assert.equal((await handler(new Request(endpoint + query))).status, 400);
  }
  assert.equal(
    (await handler(new Request(endpoint, { method: "OPTIONS" }))).status,
    204,
  );
  const write = await handler(
    new Request(endpoint + range, { method: "POST" }),
  );
  assert.equal(write.status, 405);
  assert.equal(write.headers.get("Allow"), "GET, OPTIONS");
  assert.equal(upstreamCalls, 0);
});

Deno.test("returns safe errors for missing secrets, Google failure, and a repeating page token", async () => {
  const missing = await createCalendarHandler({})(
    new Request(endpoint + range),
  );
  assert.equal(missing.status, 503);

  const failed = createCalendarHandler(
    config,
    () =>
      Promise.resolve(Response.json({ error: config.apiKey }, { status: 403 })),
  );
  const response = await failed(new Request(endpoint + range));
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: "Google Calendar is unavailable.",
  });

  let pages = 0;
  const loop = createCalendarHandler(config, () => {
    pages += 1;
    return Promise.resolve(
      Response.json({ nextPageToken: "repeated-token", items: [] }),
    );
  });
  assert.equal((await loop(new Request(endpoint + range))).status, 502);
  assert.equal(pages, 2);
});
