import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") || "/admin";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/admin";
  if (code && hasSupabaseEnv()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  return NextResponse.redirect(new URL("/login?error=invalid", origin));
}
