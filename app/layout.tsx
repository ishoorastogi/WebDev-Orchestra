import type { Metadata } from "next";
import { Suspense } from "react";
import SiteChrome from "@/src/components/SiteChrome.jsx";
import { getPublishedSite } from "@/lib/content/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import "@/src/styles/global.css";

async function SiteShell({ children }: { children: React.ReactNode }) {
  const content = hasSupabaseEnv() ? await getPublishedSite() : null;
  const nav = content?.nav.map((item) => ({ id: item.id, label: item.label, to: item.href }));
  return <SiteChrome nav={nav} school={content?.footer.school} footer={content}>{children}</SiteChrome>;
}

export const metadata: Metadata = {
  title: "Durham Middle School Orchestra",
  description: "Information and resources for Durham Middle School Orchestra families.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<main id="main">{children}</main>}><SiteShell>{children}</SiteShell></Suspense>
      </body>
    </html>
  );
}
