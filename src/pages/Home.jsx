import { useLanguage } from "../i18n/LanguageProvider.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import CtaBand from "../components/CtaBand.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { HANDBOOK_LINK, SCHOOL } from "../data/site.js";

// landing page
export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Section>
        {/* maroon hero */}
        <div className="panel">
          <div>
            <h1>{t("Welcome to Durham Orchestra")}</h1>
            <p>{t("[Short welcome from the directors about the orchestra program at {school}.]", { school: t(SCHOOL) })}</p>
            <div className="btn-row">
              <Button to="/new-to-orchestra" variant="light">{t("Join Orchestra")}</Button>
              <Button to="/returning-members" variant="ghost">{t("Returning Members")}</Button>
            </div>
          </div>
          <Photo label="Hero photo: orchestra performing" height={300} />
        </div>
      </Section>
      {/* quick links */}
      <Section title={t("Quick links")}>
        <div className="grid grid-4">
          <Card title={t("New to Orchestra")} to="/new-to-orchestra" cta={t("Learn more")}>{t("Meet the instruments and pick one.")}</Card>
          <Card title={t("Returning Members")} to="/returning-members" cta={t("Get started")}>{t("Re-enrollment, auditions, and dates.")}</Card>
          <Card title={t("Getting an Instrument")} to="/getting-an-instrument" cta={t("Rent or borrow")}>{t("Rental options and school instruments.")}</Card>
          <Card title={t(HANDBOOK_LINK.label)} to={HANDBOOK_LINK.to} cta={t("Open handbook")}>{t("View or download the handbook in English or Spanish.")}</Card>
        </div>
      </Section>
      {/* gallery, view only */}
      <Section title={t("Photo gallery")}>
        <div className="grid grid-4">
          {[1, 2, 3, 4].map((n) => (
            <Photo key={n} label={t("Photo {number}", { number: n })} height={170} />
          ))}
        </div>
        <p className="notice">{t("Photos are for viewing only.")}</p>
      </Section>
      <Section>
        <CtaBand
          title={t("Ready to join the orchestra?")}
          text={t("Start with the instruments or meet the directors.")}
          actions={[{ label: t("New to Orchestra"), to: "/new-to-orchestra" }, { label: t("Meet the directors"), to: "/directors" }]}
        />
      </Section>
    </>
  );
}
