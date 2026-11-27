import { Suspense } from "react";
import Home from "@/src/site-pages/Home.jsx";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { getPublishedPage } from "@/lib/content/server";

async function HomeContent() {
  const page = await getPublishedPage("");
  return page ? <SiteRenderer page={page} /> : <Home />;
}

export default function Page() {
  return <Suspense fallback={<Home />}><HomeContent /></Suspense>;
}
