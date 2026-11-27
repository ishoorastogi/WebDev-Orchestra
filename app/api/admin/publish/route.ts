import { NextResponse } from "next/server";
import { z } from "zod";
import { getDirector } from "@/lib/auth/director";
import { SiteContentSchema } from "@/lib/content/schema";
import { hasSameOrigin } from "@/lib/auth/origin";

const PublishRequest = z.object({ description: z.string().trim().max(200).default("Website update") });

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  const director = await getDirector();
  if (!director) return NextResponse.json({ error: "Director access required." }, { status: 401 });
  const body = PublishRequest.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid publish request." }, { status: 400 });
  const { data: draft, error: draftError } = await director.supabase.from("site_drafts").select("content").eq("singleton", true).single();
  if (draftError || !SiteContentSchema.safeParse(draft?.content).success) {
    return NextResponse.json({ error: "The draft is missing or has invalid content." }, { status: 400 });
  }
  const { data, error } = await director.supabase.rpc("publish_site_draft", { revision_description: body.data.description });
  if (error) return NextResponse.json({ error: "Publishing failed. No public changes were made." }, { status: 500 });
  return NextResponse.json({ revisionId: data }, { headers: { "Cache-Control": "private, no-store" } });
}
