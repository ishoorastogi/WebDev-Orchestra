import Link from "next/link";
import { requireDirector } from "@/lib/auth/director";
import { defaultSiteContent } from "@/lib/content/default-site";
import { SiteContentSchema } from "@/lib/content/schema";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { Suspense } from "react";

export const metadata = { title: "Draft preview | Durham Middle School Orchestra" };

async function PreviewContent({ searchParams }: PageProps<"/admin/preview">) {
  const { supabase } = await requireDirector();
  const params = await searchParams;
  const slug = typeof params.path === "string" ? params.path : "";
  const revisionId = typeof params.revision === "string" ? params.revision : null;
  const { data } = revisionId
    ? await supabase.from("published_revisions").select("content").eq("id", revisionId).maybeSingle()
    : await supabase.from("site_drafts").select("content").eq("singleton", true).maybeSingle();
  const parsed = data ? SiteContentSchema.safeParse(data.content) : null;
  const site = parsed?.success ? parsed.data : defaultSiteContent;
  const page = site.pages[slug] || site.pages[""];
  return <div className="cms-draft-preview">
    <div className="cms-preview-banner"><strong>Private draft preview</strong><span>Only signed-in directors can view this version.</span><Link href="/admin">Back to editor</Link></div>
    <nav className="cms-preview-nav" aria-label="Draft website pages">{site.nav.map((item) => {
      const target = item.href === "/" ? "" : item.href.replace(/^\//, "");
      const href = item.href.startsWith("/") ? `/admin/preview${revisionId ? `?revision=${encodeURIComponent(revisionId)}&path=${encodeURIComponent(target)}` : `?path=${encodeURIComponent(target)}`}` : item.href;
      return item.href.startsWith("/") ? <Link key={item.id} href={href}>{item.label}</Link> : <a key={item.id} href={href} target="_blank" rel="noopener noreferrer">{item.label}</a>;
    })}</nav>
    <SiteRenderer page={page} events={site.events} />
    <footer className="cms-preview-footer"><h2>{site.footer.school}</h2><p>{site.footer.description}</p>{site.footer.email && <a href={`mailto:${site.footer.email}`}>{site.footer.email}</a>}</footer>
  </div>;
}

export default function DraftPreview(props: PageProps<"/admin/preview">) {
  return <Suspense fallback={<main className="cms-login">Loading private preview…</main>}><PreviewContent {...props} /></Suspense>;
}
