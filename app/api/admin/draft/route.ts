import { NextResponse } from "next/server";
import { getDirector } from "@/lib/auth/director";
import { defaultSiteContent } from "@/lib/content/default-site";
import { SiteContentSchema } from "@/lib/content/schema";
import { hasSameOrigin } from "@/lib/auth/origin";

export async function GET() {
  const director = await getDirector();
  if (!director) return NextResponse.json({ error: "Director access required." }, { status: 401 });
  const { data, error } = await director.supabase.from("site_drafts").select("content,updated_at").eq("singleton", true).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load the draft. Apply the Supabase migration first." }, { status: 503 });
  if (!data) {
    const initial = SiteContentSchema.parse(defaultSiteContent);
    const { error: createError } = await director.supabase.rpc("save_site_draft", { p_content: initial });
    if (createError) return NextResponse.json({ error: "Could not initialize the first draft." }, { status: 503 });
    const { data: created } = await director.supabase.from("site_drafts").select("content,updated_at").eq("singleton", true).single();
    return NextResponse.json(created, { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PUT(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1_500_000) return NextResponse.json({ error: "Draft content is too large to save." }, { status: 413 });
  const director = await getDirector();
  if (!director) return NextResponse.json({ error: "Director access required." }, { status: 401 });
  const raw = await request.json().catch(() => null);
  const content = SiteContentSchema.safeParse(raw?.content);
  if (!content.success) return NextResponse.json({ error: "Please review the content fields.", issues: content.error.flatten() }, { status: 400 });
  const { data, error } = await director.supabase.rpc("save_site_draft", { p_content: content.data });
  if (error) return NextResponse.json({ error: "Draft save failed. Please retry." }, { status: 500 });
  return NextResponse.json({ savedAt: data }, { headers: { "Cache-Control": "private, no-store" } });
}
