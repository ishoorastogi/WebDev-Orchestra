import VisualEditor from "@/src/components/cms/VisualEditor";
import { requireDirector } from "@/lib/auth/director";
import { defaultSiteContent } from "@/lib/content/default-site";
import { SiteContentSchema } from "@/lib/content/schema";
import { Suspense } from "react";

export const metadata = { title: "Edit website | Durham Middle School Orchestra" };

async function AdminContent() {
  const { supabase } = await requireDirector();
  const { data } = await supabase.from("site_drafts").select("content").eq("singleton", true).maybeSingle();
  const parsed = data ? SiteContentSchema.safeParse(data.content) : null;
  const initialContent = parsed?.success ? parsed.data : defaultSiteContent;
  return <VisualEditor initialContent={initialContent} />;
}

export default function AdminPage() {
  return <Suspense fallback={<main className="cms-login">Loading editor…</main>}><AdminContent /></Suspense>;
}
