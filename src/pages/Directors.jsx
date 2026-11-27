import CtaBand from "../components/CtaBand.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { DIRECTORS_PAGE } from "../data/site.js";

// bios + group photo
export default function Directors() {
  const { title, profilesHeading, profiles, orchestraHeading, groupPhoto, cta } = DIRECTORS_PAGE;

  return (
    <>
      <PageHeader title={title} />
      <Section title={profilesHeading}>
        <div className="grid grid-2">
          {/* 1 card per dir */}
          {profiles.map((d) => (
            <article className="card" key={d.id}>
              <Photo {...d.photo} height={280} />
              <h3>{d.name}</h3>
              <p className="notice">{d.role}</p>
              <p>{d.bio}</p>
              <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a>
            </article>
          ))}
        </div>
      </Section>
      <Section title={orchestraHeading}>
        <Photo {...groupPhoto} height={300} />
      </Section>
      <Section>
        <CtaBand title={cta.title} actions={[{ id: "learn-to-join", label: cta.label, to: "/new-to-orchestra" }]} />
      </Section>
    </>
  );
}
