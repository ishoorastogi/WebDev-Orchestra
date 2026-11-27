import Link from "next/link";
import { updatePassword } from "../reset-password/actions";
import { Suspense } from "react";

async function UpdateContent({ searchParams }: PageProps<"/login/update-password">) {
  const params = await searchParams;
  const messages: Record<string, string> = { length: "Use a password between 12 and 128 characters.", failed: "Password update failed. Request a new reset link." };
  return <main className="cms-login"><section className="card"><h1>Choose a new password</h1><form action={updatePassword} className="cms-form"><label>New password<input type="password" name="password" minLength={12} maxLength={128} autoComplete="new-password" required /></label>{params.error && <p role="alert" className="cms-error">{messages[String(params.error)] || "The reset session is invalid."}</p>}<button className="btn btn-primary">Update password</button></form><Link href="/login">Back to login</Link></section></main>;
}

export default function UpdatePassword(props: PageProps<"/login/update-password">) {
  return <Suspense fallback={<main className="cms-login">Loading password form…</main>}><UpdateContent {...props} /></Suspense>;
}
