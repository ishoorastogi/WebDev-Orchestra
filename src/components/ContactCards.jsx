import { DIRECTORS } from "../data/site.js";
import Section from "./Section.jsx";

// dir emails at page btm
export default function ContactCards({ title = "Questions?" }) {
  return (
    <Section title={title}>
      <div className="grid grid-2">
        {DIRECTORS.map((d) => (
          <article className="card" key={d.email}>
            <h3>{d.name}</h3>
            <p>{d.role}</p>
            <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a>
          </article>
        ))}
      </div>
    </Section>
  );
}
