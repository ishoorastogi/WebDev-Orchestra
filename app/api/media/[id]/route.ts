import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function GET(_request: Request, { params }: RouteContext<"/api/media/[id]">) {
  if (!hasSupabaseEnv()) return NextResponse.json({ error: "Media service is not configured." }, { status: 503 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "File not found." }, { status: 404 });
  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("storage_path,is_published").eq("id", id).maybeSingle();
  if (!asset) return NextResponse.json({ error: "File not found." }, { status: 404 });
  const { data, error } = await supabase.storage.from("orchestra-media").createSignedUrl(asset.storage_path, 3600);
  if (error || !data) return NextResponse.json({ error: "File is unavailable." }, { status: 404 });
  return NextResponse.redirect(data.signedUrl, { headers: { "Cache-Control": "private, no-store" } });
}
