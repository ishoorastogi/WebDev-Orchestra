"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function loginAction(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/login?setup=required");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) redirect("/login?error=missing");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=invalid");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=invalid");
  const { data: member } = await supabase.from("director_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!member) {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }
  redirect("/admin");
}

export async function logoutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
