import Uil from "@/src/site-pages/Uil.jsx";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { getPublishedPage } from "@/lib/content/server";

async function UilContent() {
  const page = await getPublishedPage("uil");
  return page ? <SiteRenderer page={page} /> : <Uil />;
}
import { Suspense } from "react";

export default function Page() {
  return <Suspense fallback={<Uil />}><UilContent /></Suspense>;
}
