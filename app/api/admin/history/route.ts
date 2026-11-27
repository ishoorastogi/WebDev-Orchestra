import { NextResponse } from "next/server";
import { getDirector } from "@/lib/auth/director";

export async function GET(request: Request) {
  const director = await getDirector();
  if (!director) return NextResponse.json({ error: "Director access required." }, { status: 401 });
  const offsetParam = new URL(request.url).searchParams.get("offset") || "0";
  const offset = /^\d+$/.test(offsetParam) ? Math.min(Number(offsetParam), 1000000) : 0;
  const { data, error } = await director.supabase.rpc("get_published_history", { p_offset: offset, p_page_size: 50 });
  if (error) return NextResponse.json({ error: "Could not load version history." }, { status: 500 });
  return NextResponse.json({ revisions: data, total: data?.[0]?.total_count || 0 }, { headers: { "Cache-Control": "private, no-store" } });
}
