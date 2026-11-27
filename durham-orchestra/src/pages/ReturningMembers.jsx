import Card from "../components/Card.jsx";
import Checklist from "../components/Checklist.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import { Link } from "react-router-dom";
import { RETURNING_DATES } from "../data/site.js";

// returning mbr info
export default function ReturningMembers() {
  return (
    <>
      <PageHeader title="Returning Members" intro="Welcome back! Here is what you need for the new year." />
      <Section>
        <div className="callout">New to orchestra? <Link to="/new-to-orchestra">Start here.</Link></div>
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
          <Card title="Chair placement">[Process and dates.]</Card>
          <Card title="Advanced groups">[Details about special ensembles.]</Card>
        </div>
      </Section>
      <Section title="Opportunities">
        <div className="grid grid-3">
          <Card title="UIL & other groups" to="/uil" cta="Learn more">Contests and extra ensembles.</Card>
          <Card title="Leadership roles">[Section leaders and officers.]</Card>
          <Card title="Performances">[Concerts and events this year.]</Card>
        </div>
      </Section>
      <ContactCards />
    </>
  );
}
