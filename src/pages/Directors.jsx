import { useLanguage } from "../i18n/LanguageProvider.jsx";
import CtaBand from "../components/CtaBand.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { DIRECTORS } from "../data/site.js";

// bios + group photo
export default function Directors() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t("Meet the Directors")} />
      <Section title={t("Our directors")}>
        <div className="grid grid-2">
          {/* 1 card per dir */}
          {DIRECTORS.map((d) => (
            <article className="card" key={d.email}>
              <Photo label="Director photo" height={280} />
              <h3>{t(d.name)}</h3>
              <p className="notice">{t(d.role)}</p>
              <p>{t(d.bio)}</p>
              <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a>
            </article>
          ))}
        </div>
      </Section>
      <Section title={t("Orchestra")}>
        <Photo label="Full-width group photo" height={300} />
      </Section>
      <Section>
        <CtaBand title={t("Want to join the orchestra?")} actions={[{ label: t("New to Orchestra"), to: "/new-to-orchestra" }]} />
      </Section>
    </>
  );
}
