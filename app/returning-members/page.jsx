import ReturningMembers from "@/src/site-pages/ReturningMembers.jsx";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import { getPublishedPage } from "@/lib/content/server";

async function ReturningMembersContent() {
  const page = await getPublishedPage("returning-members");
  return page ? <SiteRenderer page={page} /> : <ReturningMembers />;
}
import { Suspense } from "react";

export default function Page() {
  return <Suspense fallback={<ReturningMembers />}><ReturningMembersContent /></Suspense>;
}
