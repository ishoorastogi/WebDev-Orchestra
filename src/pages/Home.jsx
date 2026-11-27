import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import CtaBand from "../components/CtaBand.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { HANDBOOK_LINK, SCHOOL } from "../data/site.js";

// landing page
export default function Home() {
  return (
    <>
      <Section>
        {/* maroon hero */}
        <div className="panel">
          <div>
            <h1>Welcome to Durham Orchestra</h1>
            <p>[Short welcome from the directors about the orchestra program at {SCHOOL}.]</p>
            <div className="btn-row">
              <Button to="/new-to-orchestra" variant="light">Join Orchestra</Button>
              <Button to="/returning-members" variant="ghost">Returning Members</Button>
            </div>
          </div>
          <Photo label="Hero photo: orchestra performing" height={300} />
        </div>
      </Section>
      {/* quick links */}
      <Section title="Quick links">
        <div className="grid grid-4">
          <Card title="New to Orchestra" to="/new-to-orchestra" cta="Learn more">Meet the instruments and pick one.</Card>
          <Card title="Returning Members" to="/returning-members" cta="Get started">Re-enrollment, auditions, and dates.</Card>
          <Card title="Getting an Instrument" to="/getting-an-instrument" cta="Rent or borrow">Rental options and school instruments.</Card>
          <Card title={HANDBOOK_LINK.label} to={HANDBOOK_LINK.to} cta="Open handbook">View or download the handbook in English or Spanish.</Card>
        </div>
      </Section>
      {/* gallery, view only */}
      <Section title="Photo gallery">
        <div className="grid grid-4">
          {[1, 2, 3, 4].map((n) => (
            <Photo key={n} label={`Photo ${n}`} height={170} />
          ))}
        </div>
        <p className="notice">Photos are for viewing only.</p>
      </Section>
      <Section>
        <CtaBand
          title="Ready to join the orchestra?"
          text="Start with the instruments or meet the directors."
          actions={[{ label: "New to Orchestra", to: "/new-to-orchestra" }, { label: "Meet the directors", to: "/directors" }]}
        />
      </Section>
    </>
  );
}
