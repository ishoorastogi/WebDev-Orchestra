import { Link } from "react-router-dom";
import { NAV, SCHOOL, BOOSTER_URL, DIRECTOR_EMAIL, CALENDAR_LINK, HANDBOOK_LINK } from "../data/site.js";

import { useLanguage } from "../i18n/LanguageProvider.jsx";

export default function Footer() {
  const { t } = useLanguage();
  const pages = [...NAV.filter((n) => n.to), CALENDAR_LINK, HANDBOOK_LINK];
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          {/* contact col */}
          <h3>{t(SCHOOL)}</h3>
          <a href={`mailto:${DIRECTOR_EMAIL}`}>{DIRECTOR_EMAIL}</a>
          <a href={BOOSTER_URL} target="_blank" rel="noopener noreferrer">{t("Booster website")}</a>
        </div>
        <div>
          {/* sitemap col */}
          <h3>{t("Pages")}</h3>
          {pages.map((p) => (
            <Link key={p.to} to={p.to}>{t(p.label)}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
