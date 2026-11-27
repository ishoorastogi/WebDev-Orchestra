import { useLanguage } from "../i18n/LanguageProvider.jsx";
// checkbox style list
export default function Checklist({ items }) {
  const { t } = useLanguage();
  return (
    <ul className="checklist">
      {items.map((item) => (
        <li key={item}>{t(item)}</li>
      ))}
    </ul>
  );
}
