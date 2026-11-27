import { Link } from "react-router-dom";
import Accordion from "../components/Accordion.jsx";
import Button from "../components/Button.jsx";
import CtaBand from "../components/CtaBand.jsx";
import InstrumentFeature from "../components/InstrumentFeature.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { INSTRUMENTS, INSTRUMENT_FAQ, NEW_TO_ORCHESTRA_PAGE } from "../data/site.js";

// intro + inst videos + faq
export default function NewToOrchestra() {
  const { header, welcome, instrumentsHeading, sizing, faqHeading, cta } = NEW_TO_ORCHESTRA_PAGE;

  return (
    <>
      <PageHeader {...header} />
      <Section title={welcome.heading}>
        <div className="split">
          <div>
            <h3>{welcome.title}</h3>
            <p>{welcome.text}</p>
            <p>{welcome.returningPrompt}{" "}<Link to="/returning-members">{welcome.returningLabel}</Link></p>
            <Button to="/getting-an-instrument">{welcome.instrumentLabel}</Button>
          </div>
          <Photo {...welcome.photo} height={240} />
        </div>
      </Section>
      <Section title={instrumentsHeading}>
        <div className="stack">
          {/* alt left/right */}
          {INSTRUMENTS.map((inst, i) => (
            <InstrumentFeature key={inst.id} {...inst} flip={i % 2 === 1} />
          ))}
        </div>
      </Section>
      <Section>
        <div className="callout">
          <h3>{sizing.title}</h3>
          <p>{sizing.text}</p>
        </div>
      </Section>
      <Section title={faqHeading}>
        <Accordion items={INSTRUMENT_FAQ} />
      </Section>
      <Section>
        <CtaBand title={cta.title} actions={[{ id: "find-an-instrument", label: cta.label, to: "/getting-an-instrument" }]} />
      </Section>
    </>
  );
}
