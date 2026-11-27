import Directors from "@/src/site-pages/Directors.jsx";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { getPublishedPage } from "@/lib/content/server";

async function DirectorsContent() {
  const page = await getPublishedPage("directors");
  return page ? <SiteRenderer page={page} /> : <Directors />;
}
import { Suspense } from "react";

export default function Page() {
  return <Suspense fallback={<Directors />}><DirectorsContent /></Suspense>;
}
