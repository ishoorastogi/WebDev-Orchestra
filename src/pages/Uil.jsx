import Card from "../components/Card.jsx";
import ContactCards from "../components/ContactCards.jsx";
import DocumentList from "../components/DocumentList.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import { DOCUMENTS, UIL_DATES, UIL_PAGE } from "../data/site.js";

// uil info + forms
export default function Uil() {
  const { title, overview, timelineHeading, otherGroups, documentsHeading } = UIL_PAGE;

  return (
    <>
      <PageHeader title={title} />
      <Section title={overview.heading}>
        <div className="split">
          <div>
            <p>{overview.text}</p>
          </div>
          <Photo {...overview.photo} height={240} />
        </div>
      </Section>
      <Section title={timelineHeading}><Timeline items={UIL_DATES} /></Section>
      {/* placeholder groups */}
      <Section title={otherGroups.heading}>
        <div className="grid grid-3">
          {otherGroups.groups.map(({ id, title, text }) => (
            <Card key={id} title={title}>{text}</Card>
          ))}
        </div>
      </Section>
      <Section title={documentsHeading}><DocumentList items={DOCUMENTS} /></Section>
      <ContactCards />
    </>
  );
}
