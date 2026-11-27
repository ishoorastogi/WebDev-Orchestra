import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import CtaBand from "../components/CtaBand.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { HOME_PAGE } from "../data/site.js";

// landing page
export default function Home() {
  const { hero, quickLinks, gallery, cta } = HOME_PAGE;
  const quickLinkCards = [
    { ...quickLinks.newToOrchestra, to: "/new-to-orchestra" },
    { ...quickLinks.returningMembers, to: "/returning-members" },
    { ...quickLinks.gettingAnInstrument, to: "/getting-an-instrument" },
  ];

  return (
    <>
      <Section>
        {/* maroon hero */}
        <div className="panel">
          <div>
            <h1>{hero.title}</h1>
            <p>{hero.welcome}</p>
            <div className="btn-row">
              <Button to="/new-to-orchestra" variant="light">{hero.joinLabel}</Button>
              <Button to="/returning-members" variant="ghost">{hero.returningLabel}</Button>
            </div>
          </div>
          <Photo {...hero.photo} height={300} />
        </div>
      </Section>
      {/* quick links */}
      <Section title={quickLinks.heading}>
        <div className="grid grid-3">
          {quickLinkCards.map(({ title, to, cta, text }) => (
            <Card key={to} title={title} to={to} cta={cta}>{text}</Card>
          ))}
        </div>
      </Section>
      {/* gallery, view only */}
      <Section title={gallery.heading}>
        <div className="grid grid-4">
          {gallery.photos.map((photo) => (
            <Photo key={photo.id} {...photo} height={170} />
          ))}
        </div>
        <p className="notice">{gallery.notice}</p>
      </Section>
      <Section>
        <CtaBand
          title={cta.title}
          text={cta.text}
          actions={[
            { id: "learn-to-join", label: cta.newToOrchestraLabel, to: "/new-to-orchestra" },
            { id: "meet-the-directors", label: cta.directorsLabel, to: "/directors" },
          ]}
        />
      </Section>
    </>
  );
}
