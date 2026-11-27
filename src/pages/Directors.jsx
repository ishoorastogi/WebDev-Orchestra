import CtaBand from "../components/CtaBand.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { DIRECTORS } from "../data/site.js";

// bios + group photo
export default function Directors() {
  return (
    <>
      <PageHeader title="Meet the Directors" />
      <Section title="Our directors">
        <div className="grid grid-2">
          {/* 1 card per dir */}
          {DIRECTORS.map((d) => (
            <article className="card" key={d.email}>
              <Photo label="Director photo" height={280} />
              <h3>{d.name}</h3>
              <p className="notice">{d.role}</p>
              <p>{d.bio}</p>
              <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Orchestra">
        <Photo label="Full-width group photo" height={300} />
      </Section>
      <Section>
        <CtaBand title="Want to join the orchestra?" actions={[{ label: "New to Orchestra", to: "/new-to-orchestra" }]} />
      </Section>
    </>
  );
}
