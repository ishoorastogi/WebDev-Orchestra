import { useLanguage } from "../i18n/LanguageProvider.jsx";
import Card from "../components/Card.jsx";
import Checklist from "../components/Checklist.jsx";
import ContactCards from "../components/ContactCards.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import { Link } from "react-router-dom";
import { RETURNING_DATES } from "../data/site.js";

// returning mbr info
export default function ReturningMembers() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t("Returning Members")} intro={t("Welcome back! Here is what you need for the new year.")} />
      <Section>
        <div className="callout">{t("New to orchestra?")}{" "}<Link to="/new-to-orchestra">{t("Start here.")}</Link></div>
      </Section>
      {/* key dates */}
      <Section title={t("Key dates")}><Timeline items={RETURNING_DATES} /></Section>
      <Section title={t("Re-enrollment and instruments")}>
        <div className="split">
          <Checklist items={["Complete registration", "Submit forms and fees", "Renew rental or size up", "Review handbook updates"]} />
          <Photo label="Photo: returning students" height={220} />
        </div>
      </Section>
      <Section title={t("Auditions and seating")}>
        <div className="grid grid-2">
          <Card title={t("Chair placement")}>{t("[Process and dates.]")}</Card>
          <Card title={t("Advanced groups")}>{t("[Details about special ensembles.]")}</Card>
        </div>
      </Section>
      <Section title={t("Opportunities")}>
        <div className="grid grid-3">
          <Card title={t("UIL & other groups")} to="/uil" cta={t("Learn more")}>{t("Contests and extra ensembles.")}</Card>
          <Card title={t("Leadership roles")}>{t("[Section leaders and officers.]")}</Card>
          <Card title={t("Performances")}>{t("[Concerts and events this year.]")}</Card>
        </div>
      </Section>
      <ContactCards />
    </>
  );
}
