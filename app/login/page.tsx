import { loginAction } from "./actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Suspense } from "react";

export const metadata = { title: "Director login | Durham Middle School Orchestra" };

async function LoginContent({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const messages: Record<string, string> = {
    missing: "Enter your email and password.",
    invalid: "The email or password was not accepted.",
    unauthorized: "This account is not enabled as the orchestra director.",
  };
  const configured = hasSupabaseEnv();
  return <main className="cms-login"><section className="card">
    <h1>Director login</h1>
    <p>Sign in to edit the orchestra website.</p>
    {!configured ? <div className="callout"><strong>Setup required.</strong><p>Connect a Supabase project and provision the director account. See <code>docs/cms-setup.md</code>.</p></div> : <form action={loginAction} className="cms-form">
      <label>Email<input name="email" type="email" autoComplete="username" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {params.error && <p className="cms-error" role="alert">{messages[String(params.error)] || "Sign-in failed."}</p>}
      {params.setup && <p className="cms-error" role="alert">CMS setup is incomplete.</p>}
      <button type="submit" className="btn btn-primary">Sign in</button>
      <p className="cms-help">No public sign-up is available. <a href="/login/reset-password">Reset your password</a>.</p>
    </form>}
  </section></main>;
}

export default function LoginPage(props: PageProps<"/login">) {
  return <Suspense fallback={<main className="cms-login">Loading login…</main>}><LoginContent {...props} /></Suspense>;
}
