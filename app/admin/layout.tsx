import Link from "next/link";
import { Suspense } from "react";
import { requireDirector } from "@/lib/auth/director";
import { logoutAction } from "@/app/login/actions";

async function DirectorShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await requireDirector();
  return <div className="cms-shell">
    <header className="cms-toolbar"><Link href="/admin" className="cms-brand">Orchestra site editor</Link>
      <nav aria-label="Editor"><Link href="/admin">Edit site</Link><Link href="/admin/preview">Preview draft</Link><Link href="/admin/history">Published versions</Link></nav>
      <span className="cms-user">{user.email}</span><form action={logoutAction}><button className="cms-link-button">Log out</button></form>
    </header>
    {children}
  </div>;
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<main className="cms-login">Checking director access…</main>}><DirectorShell>{children}</DirectorShell></Suspense>;
}
