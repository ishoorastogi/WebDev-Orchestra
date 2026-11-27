import Link from "next/link";
import Accordion from "../components/Accordion.jsx";
import Button from "../components/Button.jsx";
import CtaBand from "../components/CtaBand.jsx";
import InstrumentFeature from "../components/InstrumentFeature.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { INSTRUMENTS, INSTRUMENT_FAQ } from "../data/site.js";

// intro + inst videos + faq
export default function NewToOrchestra() {
  return (
    <>
      <PageHeader title="New to Orchestra" intro="No experience needed. Meet the instruments, listen, and pick your favorite." />
      <Section title="Welcome, new players!">
        <div className="split">
          <div>
            <h3>No experience needed</h3>
            <p>No experience is needed to get started. Class details will be shared by the directors.</p>
            <p>Already in orchestra? <Link href="/returning-members">Returning members start here.</Link></p>
            <Button to="/getting-an-instrument">Getting an Instrument</Button>
          </div>
          <Photo label="Photo: beginner class" height={240} />
        </div>
      </Section>
      <Section title="Meet the instruments">
        <div className="stack">
          {/* alt left/right */}
          {INSTRUMENTS.map((inst, i) => (
            <InstrumentFeature key={inst.name} {...inst} flip={i % 2 === 1} />
          ))}
        </div>
      </Section>
      <Section>
        <div className="callout">
          <h3>Any height can play</h3>
          <p>Every instrument comes in multiple sizes, so students of any height can play any instrument.</p>
        </div>
      </Section>
      <Section title="FAQ">
        <Accordion items={INSTRUMENT_FAQ} />
      </Section>
      <Section>
        <CtaBand title="Ready to pick an instrument?" actions={[{ label: "Getting an Instrument", to: "/getting-an-instrument" }]} />
      </Section>
    </>
  );
}
