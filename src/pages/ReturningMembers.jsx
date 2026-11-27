import Card from "../components/Card.jsx";
import Checklist from "../components/Checklist.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import { Link } from "react-router-dom";
import { RETURNING_DATES, RETURNING_MEMBERS_PAGE } from "../data/site.js";

// returning mbr info
export default function ReturningMembers() {
  const { header, beginnerCallout, datesHeading, reenrollment, auditions, opportunities } = RETURNING_MEMBERS_PAGE;

  return (
    <>
      <PageHeader {...header} />
      <Section>
        <div className="callout">{beginnerCallout.text}{" "}<Link to="/new-to-orchestra">{beginnerCallout.label}</Link></div>
      </Section>
      {/* key dates */}
      <Section title={datesHeading}><Timeline items={RETURNING_DATES} /></Section>
      <Section title={reenrollment.heading}>
        <div className="split">
          <Checklist items={reenrollment.checklist} />
          <Photo {...reenrollment.photo} height={220} />
        </div>
      </Section>
      <Section title={auditions.heading}>
        <div className="grid grid-2">
          <Card title={auditions.chairPlacement.title}>{auditions.chairPlacement.text}</Card>
          <Card title={auditions.advancedGroups.title}>{auditions.advancedGroups.text}</Card>
        </div>
      </Section>
      <Section title={opportunities.heading}>
        <div className="grid grid-3">
          <Card title={opportunities.uil.title} to="/uil" cta={opportunities.uil.cta}>{opportunities.uil.text}</Card>
          <Card title={opportunities.leadership.title}>{opportunities.leadership.text}</Card>
          <Card title={opportunities.performances.title}>{opportunities.performances.text}</Card>
        </div>
      </Section>
      <ContactCards />
    </>
  );
}
