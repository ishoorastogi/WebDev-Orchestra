import GettingInstrument from "@/src/site-pages/GettingInstrument.jsx";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { getPublishedPage } from "@/lib/content/server";

async function GettingInstrumentContent() {
  const page = await getPublishedPage("getting-an-instrument");
  return page ? <SiteRenderer page={page} /> : <GettingInstrument />;
}
import { Suspense } from "react";

export default function Page() {
  return <Suspense fallback={<GettingInstrument />}><GettingInstrumentContent /></Suspense>;
}
