import Accordion from "../components/Accordion.jsx";
import Card from "../components/Card.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Section from "../components/Section.jsx";
import Steps from "../components/Steps.jsx";
import { INSTRUMENT_STEPS, RENTALS } from "../data/site.js";

// local faq items
const FAQ = [
  { q: "Monthly vs. yearly payment", a: "Renting by the year costs less than paying monthly. [Add details.]" },
  { q: "Instrument sizes", a: "Each instrument comes in multiple sizes. The directors help you pick one." },
  { q: "Supplies checklist", a: "[List the supplies every student needs.]" },
  { q: "Who do I contact?", a: "Email the directors using the contacts below." },
];

// steps + rentals
export default function GettingInstrument() {
  return (
    <>
      <PageHeader title="Getting an Instrument" intro="Rent from a local company or ask about a school instrument." />
      <Section title="Steps"><Steps items={INSTRUMENT_STEPS} /></Section>
      <Section title="Rental options">
        <div className="grid grid-3">
          {RENTALS.map((r) => (
            <Card key={r.name} title={r.name} to={r.to} href={r.href} cta={r.cta}>{r.text}</Card>
          ))}
        </div>
      </Section>
      <Section title="FAQ"><Accordion items={FAQ} /></Section>
      <ContactCards />
    </>
  );
}
