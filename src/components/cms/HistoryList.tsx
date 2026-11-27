"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Revision = { id: string; description: string; created_at: string; published_by_email: string; total_count: number };

export default function HistoryList({ revisions: initialRevisions, total }: { revisions: Revision[]; total: number }) {
  const router = useRouter();
  const [revisions, setRevisions] = useState(initialRevisions);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const restore = async (id: string) => {
    if (!window.confirm("Restore this version as the current draft? It will not be published until you choose Publish changes.")) return;
    setBusy(id); setMessage("");
    try {
      const response = await fetch("/api/admin/restore", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ revisionId: id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Restore failed.");
      router.push("/admin");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Restore failed."); setBusy(""); }
  };
  const loadMore = async () => {
    setLoadingMore(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/history?offset=${revisions.length}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load more versions.");
      setRevisions((current) => [...current, ...result.revisions]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not load more versions."); }
    finally { setLoadingMore(false); }
  };
  if (!revisions.length) return <div className="callout"><p>No published versions yet. Publish the first website update from the editor to start history.</p><Link href="/admin">Open the editor</Link></div>;
  return <div>{message && <p className="cms-error" role="alert">{message}</p>}{revisions.map((revision) => <article className="card cms-history-card" key={revision.id}>
    <div><h2>{revision.description}</h2><p>{new Date(revision.created_at).toLocaleString()}</p><small>Published by {revision.published_by_email}</small></div>
    <div><Link className="btn btn-outline" href={`/admin/preview?revision=${revision.id}`}>Preview version</Link><button className="btn btn-primary" disabled={Boolean(busy)} onClick={() => void restore(revision.id)}>{busy === revision.id ? "Restoring…" : "Restore to draft"}</button></div>
  </article>)}{revisions.length < total && <button className="btn btn-outline" disabled={loadingMore} onClick={() => void loadMore()}>{loadingMore ? "Loading…" : "Load more versions"}</button>}</div>;
}
