import { useLanguage } from "../i18n/LanguageProvider.jsx";
import Button from "./Button.jsx";

// pdf download rows
export default function DocumentList({ items }) {
  const { t } = useLanguage();
  return (
    <div className="grid">
      {items.map((doc) => (
        <div className="doc-row" key={doc.href}>
          <span>PDF &nbsp; {t(doc.name)}</span>
          <Button variant="outline" href={doc.href} download>{t("Download")}</Button>
        </div>
      ))}
    </div>
  );
}
