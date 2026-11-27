const CENTRAL = "America/Chicago";
const DAY = 86_400_000;
const MAX_PAGES = 10;
const GOOGLE_FIELDS =
  "nextPageToken,items(id,status,visibility,summary,description,location,start(date,dateTime),end(date,dateTime))";

const centralDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: CENTRAL,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const centralClock = new Intl.DateTimeFormat("en-US", {
  timeZone: CENTRAL,
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

type CalendarConfig = { calendarId?: string; apiKey?: string };

type GoogleEvent = {
  id?: string;
  status?: string;
  visibility?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
};

type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  allDay: boolean;
  firstDate: string;
  lastDate: string;
  startsAt: string | null;
  endsAt: string | null;
};

function dateMilliseconds(value: string | null | undefined) {
  if (
    !value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")
  ) return NaN;
  const instant = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(instant) &&
      new Date(instant).toISOString().slice(0, 10) === value
    ? instant
    : NaN;
}

function centralMidnight(date: string) {
  // On a Central date, 06:00 UTC is at or just after local midnight,
  // before the clock changes on either DST transition day.
  const candidate = new Date(date + "T06:00:00Z");
  const parts = Object.fromEntries(
    centralClock.formatToParts(candidate).map((
      { type, value },
    ) => [type, value]),
  );
  const seconds = Number(parts.hour) * 3600 + Number(parts.minute) * 60 +
    Number(parts.second);
  return new Date(candidate.getTime() - seconds * 1000).toISOString();
}

function centralDateKey(instant: number) {
  const parts = Object.fromEntries(
    centralDate.formatToParts(instant).map(({ type, value }) => [type, value]),
  );
  return [parts.year.padStart(4, "0"), parts.month, parts.day].join("-");
}

function eventInstant(value: string | undefined) {
  return value && /(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
    ? Date.parse(value)
    : NaN;
}

function normalize(event: GoogleEvent | null): CalendarEvent | null {
  if (
    !event?.id || !event.start || !event.end || event.status === "cancelled" ||
    event.visibility === "private" || event.visibility === "confidential"
  ) return null;

  const details = {
    id: event.id,
    title: event.summary?.trim() || "Calendar event",
    description: event.description ?? null,
    location: event.location ?? null,
  };
  const allDayStart = event.start.date;
  const allDayEnd = event.end.date;
  if (
    allDayStart && allDayEnd &&
    dateMilliseconds(allDayEnd) > dateMilliseconds(allDayStart)
  ) {
    return {
      ...details,
      allDay: true,
      firstDate: allDayStart,
      lastDate: new Date(dateMilliseconds(allDayEnd) - DAY).toISOString().slice(
        0,
        10,
      ),
      startsAt: null,
      endsAt: null,
    };
  }

  const startsAt = eventInstant(event.start.dateTime);
  const endsAt = eventInstant(event.end.dateTime);
  if (
    !Number.isFinite(startsAt) || !Number.isFinite(endsAt) || endsAt < startsAt
  ) return null;
  return {
    ...details,
    allDay: false,
    firstDate: centralDateKey(startsAt),
    lastDate: centralDateKey(Math.max(startsAt, endsAt - 1)),
    startsAt: new Date(startsAt).toISOString(),
    endsAt: new Date(endsAt).toISOString(),
  };
}

async function fetchEvents(
  start: string,
  end: string,
  calendarId: string,
  apiKey: string,
  fetchGoogle: typeof fetch,
) {
  const url = new URL(
    "https://www.googleapis.com/calendar/v3/calendars/" +
      encodeURIComponent(calendarId) + "/events",
  );
  url.search = new URLSearchParams({
    timeMin: centralMidnight(start),
    timeMax: centralMidnight(end),
    timeZone: CENTRAL,
    singleEvents: "true",
    orderBy: "startTime",
    showDeleted: "false",
    maxResults: "250",
    fields: GOOGLE_FIELDS,
  }).toString();

  const events: CalendarEvent[] = [];
  const tokens = new Set<string>();
  const signal = AbortSignal.timeout(10_000);

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await fetchGoogle(url.href, {
      headers: { "x-goog-api-key": apiKey, Accept: "application/json" },
      redirect: "error",
      signal,
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error("Google Calendar request failed");
    }

    const data = await response.json();
    for (const item of data.items ?? []) {
      const event = normalize(item);
      if (event && event.lastDate >= start && event.firstDate < end) {
        events.push(event);
      }
    }

    const token = data.nextPageToken;
    if (!token) return events;
    if (typeof token !== "string" || tokens.has(token)) break;
    tokens.add(token);
    url.searchParams.set("pageToken", token);
  }
  throw new Error("Google Calendar pagination did not finish");
}

function error(
  message: string,
  status: number,
  headers?: Record<string, string>,
) {
  return Response.json({ error: message }, {
    status,
    headers: { ...corsHeaders, ...headers },
  });
}

export function createCalendarHandler(
  { calendarId, apiKey }: CalendarConfig,
  fetchGoogle = fetch,
) {
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== "GET") {
      return error("Method not allowed.", 405, { Allow: "GET, OPTIONS" });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const days = (dateMilliseconds(end) - dateMilliseconds(start)) / DAY;
    if (!start || !end || !Number.isFinite(days) || days < 1 || days > 42) {
      return error("Expected a range of 1 to 42 days.", 400);
    }
    if (!calendarId || !apiKey) {
      return error("Calendar is not configured.", 503);
    }

    try {
      const events = await fetchEvents(
        start,
        end,
        calendarId,
        apiKey,
        fetchGoogle,
      );
      return Response.json(events, {
        headers: { ...corsHeaders, "Cache-Control": "public, max-age=30" },
      });
    } catch {
      return error("Google Calendar is unavailable.", 502);
    }
  };
}
