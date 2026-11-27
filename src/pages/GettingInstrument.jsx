import Accordion from "../components/Accordion.jsx";
import Card from "../components/Card.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Section from "../components/Section.jsx";
import Steps from "../components/Steps.jsx";
import { GETTING_AN_INSTRUMENT_PAGE, INSTRUMENT_STEPS, RENTALS } from "../data/site.js";

// steps + rentals
export default function GettingInstrument() {
  const { header, stepsHeading, rentalsHeading, faq } = GETTING_AN_INSTRUMENT_PAGE;

  return (
    <>
      <PageHeader {...header} />
      <Section title={stepsHeading}><Steps items={INSTRUMENT_STEPS} /></Section>
      <Section title={rentalsHeading}>
        <div className="grid grid-3">
          {RENTALS.map((r) => (
            <Card key={r.id} title={r.name} to={r.to} href={r.href} cta={r.cta}>{r.text}</Card>
          ))}
        </div>
      </Section>
      <Section title={faq.heading}><Accordion items={faq.items} /></Section>
      <ContactCards />
    </>
  );
}
