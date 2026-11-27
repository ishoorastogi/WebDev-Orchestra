import { useLanguage } from "../i18n/LanguageProvider.jsx";
import Card from "../components/Card.jsx";
import ContactCards from "../components/ContactCards.jsx";
import DocumentList from "../components/DocumentList.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import Timeline from "../components/Timeline.jsx";
import { DOCUMENTS, UIL_DATES } from "../data/site.js";

// uil info + forms
export default function Uil() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t("UIL Info & Other Groups")} />
      <Section title={t("What is UIL?")}>
        <div className="split">
          <div>
            <p>{t("[Short explanation of UIL orchestra contests, who can take part, and what to expect.]")}</p>
          </div>
          <Photo label="Photo: contest" height={240} />
        </div>
      </Section>
      <Section title={t("How it works")}><Timeline items={UIL_DATES} /></Section>
      {/* placeholder groups */}
      <Section title={t("Other groups")}>
        <div className="grid grid-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} title={t("[Group name]")}>{t("[Who it is for, when it meets, how to join.]")}</Card>
          ))}
        </div>
      </Section>
      <Section title={t("Forms and documents")}><DocumentList items={DOCUMENTS} /></Section>
      <ContactCards />
    </>
  );
}
