import { createCalendarHandler } from "./calendar.ts";

Deno.serve(createCalendarHandler({
  calendarId: Deno.env.get("GOOGLE_CALENDAR_ID")?.trim(),
  apiKey: Deno.env.get("GOOGLE_CALENDAR_API_KEY")?.trim(),
}));
