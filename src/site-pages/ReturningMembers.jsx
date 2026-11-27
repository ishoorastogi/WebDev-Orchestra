import Card from "../components/Card.jsx";
import Checklist from "../components/Checklist.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import Link from "next/link";
import { RETURNING_DATES } from "../data/site.js";

// returning mbr info
export default function ReturningMembers() {
  return (
    <>
      <PageHeader title="Returning Members" intro="Welcome back! Here is what you need for the new year." />
      <Section>
        <div className="callout">New to orchestra? <Link href="/new-to-orchestra">Start here.</Link></div>
      </Section>
      {/* key dates */}
      <Section title="Key dates"><Timeline items={RETURNING_DATES} /></Section>
      <Section title="Re-enrollment and instruments">
        <div className="split">
          <Checklist items={["Complete registration", "Submit forms and fees", "Renew rental or size up", "Review handbook updates"]} />
          <Photo label="Photo: returning students" height={220} />
        </div>
      </Section>
      <Section title="Auditions and seating">
        <div className="grid grid-2">
          <Card title="Chair placement">Process and dates will be shared when confirmed.</Card>
          <Card title="Advanced groups">Ensemble details will be shared when confirmed.</Card>
        </div>
      </Section>
      <Section title="Opportunities">
        <div className="grid grid-3">
          <Card title="UIL & other groups" to="/uil" cta="Learn more">Contests and extra ensembles.</Card>
          <Card title="Leadership roles">Information about leadership opportunities will be shared when available.</Card>
          <Card title="Performances">Concert information will be added when dates are confirmed.</Card>
        </div>
      </Section>
      <ContactCards />
    </>
  );
}
