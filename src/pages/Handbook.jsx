import Accordion from "../components/Accordion.jsx";
import Button from "../components/Button.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Section from "../components/Section.jsx";
import { HANDBOOK } from "../data/site.js";

export default function Handbook() {
  return (
    <div className="handbook-page">
      <PageHeader title={HANDBOOK.title} />
      <Section>
        <div className="grid handbook-grid">
          {HANDBOOK.documents.map((doc) => (
            <article className="card handbook-card" key={doc.lang} lang={doc.lang}>
              <span className="handbook-language-badge">{doc.badge}</span>
              <h2>{doc.title}</h2>
              <div className="handbook-card-actions">
                <Button variant="light" href={doc.href} download>{doc.downloadLabel}</Button>
                <Button variant="ghost" href={doc.href} target="_blank" rel="noopener noreferrer">{doc.viewLabel}</Button>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section title={HANDBOOK.highlightsTitle}>
        <Accordion items={HANDBOOK.highlights} singleOpen />
      </Section>
      <ContactCards title={HANDBOOK.contactTitle} />
    </div>
  );
}
