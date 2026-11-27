import { getEvents } from "@/content";
import { getPublishedSite } from "@/lib/content/server";

export async function GET() {
  const site = await getPublishedSite();
  const events = site ? site.events.filter((event) => event.visible) : await getEvents();
  return Response.json(events, { headers: { "Cache-Control": "no-store" } });
}
