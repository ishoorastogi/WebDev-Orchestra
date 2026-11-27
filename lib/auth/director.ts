import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function getDirector() {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: membership } = await supabase
    .from("director_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return membership ? { user, supabase } : null;
}

export async function requireDirector() {
  const director = await getDirector();
  if (!director) redirect(hasSupabaseEnv() ? "/login" : "/login?setup=required");
  return director;
}
