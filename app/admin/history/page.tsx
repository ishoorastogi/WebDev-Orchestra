import HistoryList from "@/src/components/cms/HistoryList";
import { requireDirector } from "@/lib/auth/director";
import { Suspense } from "react";

export const metadata = { title: "Published versions | Durham Middle School Orchestra" };

async function HistoryContent() {
  const { supabase } = await requireDirector();
  const { data } = await supabase.rpc("get_published_history", { p_offset: 0, p_page_size: 50 });
  return <main className="cms-history"><h1>Published versions</h1><p>Each successful publish creates a permanent version. Restoring one makes a new editable draft and leaves history intact.</p><HistoryList revisions={data || []} total={Number(data?.[0]?.total_count || 0)} /></main>;
}

export default function HistoryPage() {
  return <Suspense fallback={<main className="cms-history">Loading version history…</main>}><HistoryContent /></Suspense>;
}
