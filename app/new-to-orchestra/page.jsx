import NewToOrchestra from "@/src/site-pages/NewToOrchestra.jsx";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { getPublishedPage } from "@/lib/content/server";

async function NewToOrchestraContent() {
  const page = await getPublishedPage("new-to-orchestra");
  return page ? <SiteRenderer page={page} /> : <NewToOrchestra />;
}
import { Suspense } from "react";

export default function Page() {
  return <Suspense fallback={<NewToOrchestra />}><NewToOrchestraContent /></Suspense>;
}
