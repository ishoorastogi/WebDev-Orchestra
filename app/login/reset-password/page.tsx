import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { Suspense } from "react";

async function ResetContent({ searchParams }: PageProps<"/login/reset-password">) {
  const params = await searchParams;
  return <main className="cms-login"><section className="card"><h1>Reset director password</h1>
    {params.sent ? <p>If that address belongs to an account, a password reset link will arrive by email.</p> : <form action={requestPasswordReset} className="cms-form"><label>Email<input type="email" name="email" autoComplete="email" required /></label><button className="btn btn-primary">Send reset link</button></form>}
    <Link href="/login">Back to login</Link>
  </section></main>;
}

export default function ResetPassword(props: PageProps<"/login/reset-password">) {
  return <Suspense fallback={<main className="cms-login">Loading…</main>}><ResetContent {...props} /></Suspense>;
}
