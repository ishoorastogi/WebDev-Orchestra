import "server-only";
import type { SiteContent } from "./schema";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";
import { connection } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function getPublishedSite(): Promise<SiteContent | null> {
  if (!hasSupabaseEnv()) return null;
  await connection();
  const { url, key } = getSupabaseEnv();
  const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: setting, error: settingError } = await supabase
    .from("site_settings").select("current_revision_id").eq("singleton", true).maybeSingle();
  if (settingError || !setting?.current_revision_id) return null;
  const { data: revision, error } = await supabase
    .from("published_revisions").select("content").eq("id", setting.current_revision_id).single();
  if (error || !revision) return null;
  return revision.content as SiteContent;
}

export async function getPublishedPage(slug: string) {
  const site = await getPublishedSite();
  return site?.pages[slug] || null;
}
