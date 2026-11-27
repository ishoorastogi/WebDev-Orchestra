import Card from "../components/Card.jsx";
import ContactCards from "../components/ContactCards.jsx";
import DocumentList from "../components/DocumentList.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import { DOCUMENTS, UIL_DATES } from "../data/site.js";

// uil info + forms
export default function Uil() {
  return (
    <>
      <PageHeader title="UIL Info & Other Groups" />
      <Section title="What is UIL?">
        <div className="split">
          <div>
            <p>[Short explanation of UIL orchestra contests, who can take part, and what to expect.]</p>
          </div>
          <Photo label="Photo: contest" height={240} />
        </div>
      </Section>
      <Section title="How it works"><Timeline items={UIL_DATES} /></Section>
      {/* placeholder groups */}
      <Section title="Other groups">
        <div className="grid grid-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} title="[Group name]">[Who it is for, when it meets, how to join.]</Card>
          ))}
        </div>
      </Section>
      <Section title="Forms and documents"><DocumentList items={DOCUMENTS} /></Section>
      <ContactCards />
    </>
  );
}
