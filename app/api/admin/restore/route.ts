import { NextResponse } from "next/server";
import { z } from "zod";
import { getDirector } from "@/lib/auth/director";
import { SiteContentSchema } from "@/lib/content/schema";
import { hasSameOrigin } from "@/lib/auth/origin";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  const director = await getDirector();
  if (!director) return NextResponse.json({ error: "Director access required." }, { status: 401 });
  const input = z.object({ revisionId: z.string().uuid() }).safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Choose a valid published version." }, { status: 400 });
  const { data: revision, error: readError } = await director.supabase.from("published_revisions")
    .select("content").eq("id", input.data.revisionId).single();
  if (readError || !revision) return NextResponse.json({ error: "That version could not be found." }, { status: 404 });
  const content = SiteContentSchema.safeParse(revision.content);
  if (!content.success) return NextResponse.json({ error: "This version has invalid content and cannot be restored." }, { status: 400 });
  const { error } = await director.supabase.rpc("save_site_draft", { p_content: content.data });
  if (error) return NextResponse.json({ error: "Could not create a draft from that version." }, { status: 500 });
  return NextResponse.json({ restored: true }, { headers: { "Cache-Control": "private, no-store" } });
}
