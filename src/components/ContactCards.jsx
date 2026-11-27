import { DIRECTORS, SHARED_CONTENT } from "../data/site.js";
import Section from "./Section.jsx";

// dir emails at page btm
export default function ContactCards() {
  return (
    <Section title={SHARED_CONTENT.contactHeading}>
      <div className="grid grid-2">
        {DIRECTORS.map((d) => (
          <article className="card" key={d.id}>
            <h3>{d.name}</h3>
            <p>{d.role}</p>
            <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a>
          </article>
        ))}
      </div>
    </Section>
  );
}
