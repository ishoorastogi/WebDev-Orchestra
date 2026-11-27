import { getEvents } from 

export async function GET() {
  const events = await getEvents();
  return Response.json(events);
}