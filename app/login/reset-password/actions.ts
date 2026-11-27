"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function requestPasswordReset(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/login/reset-password?setup=required");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || email.length > 254) redirect("/login/reset-password?sent=1");
  const headerStore = await headers();
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const forwardedHost = headerStore.get("x-forwarded-host") || headerStore.get("host");
  const forwardedProto = headerStore.get("x-forwarded-proto") || "http";
  const origin = configuredOrigin || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : "http://localhost:3000");
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/login/update-password` });
  // The same message is shown whether or not the address belongs to an account.
  redirect("/login/reset-password?sent=1");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 12 || password.length > 128) redirect("/login/update-password?error=length");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=invalid");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/login/update-password?error=failed");
  redirect("/admin");
}
