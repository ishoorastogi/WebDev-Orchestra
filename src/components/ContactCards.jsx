import { DIRECTORS } from "../data/site.js";
import Section from "./Section.jsx";

// dir emails at page btm
export default function ContactCards() {
  return (
    <Section title="Questions?">
      <div className="grid grid-2">
        {DIRECTORS.map((d) => (
          <article className="card" key={d.role}>
            <h3>{d.name}</h3>
            <p>{d.role}</p>
            {d.email ? <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a> : <p>Director contact details will be added here.</p>}
          </article>
        ))}
      </div>
    </Section>
  );
}
