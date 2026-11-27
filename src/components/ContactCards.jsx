import { DIRECTORS } from "../data/site.js";
import Section from "./Section.jsx";
import { useLanguage } from "../i18n/LanguageProvider.jsx";

// dir emails at page btm
export default function ContactCards({ title = "Questions?" }) {
  const { t } = useLanguage();
  return (
    <Section title={t(title)}>
      <div className="grid grid-2">
        {DIRECTORS.map((d) => (
          <article className="card" key={d.email}>
            <h3>{t(d.name)}</h3>
            <p>{t(d.role)}</p>
            <a className="card-link" href={`mailto:${d.email}`}>{d.email}</a>
          </article>
        ))}
      </div>
    </Section>
  );
}
