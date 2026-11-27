import { useLanguage } from "../i18n/LanguageProvider.jsx";
import { Link } from "react-router-dom";

// maroon title band
export default function PageHeader({ title, intro }) {
  const { t } = useLanguage();
  return (
    <header className="page-header">
      <div className="container">
        {/* breadcrumb */}
        <div className="crumbs">
          <Link to="/" style={{ color: "inherit" }}>{t("Home")}</Link> / {title}
        </div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}
