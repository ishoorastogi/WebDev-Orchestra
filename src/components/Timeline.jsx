import { useLanguage } from "../i18n/LanguageProvider.jsx";
// dates in a row
export default function Timeline({ items }) {
  const { t } = useLanguage();
  return (
    <ol className="timeline" style={{ listStyle: "none", margin: 0 }}>
      {items.map((item) => (
        <li key={item.title}>
          <div className="dot" />
          <div className="date">{t(item.date)}</div>
          <h3>{t(item.title)}</h3>
          <p>{t(item.text)}</p>
        </li>
      ))}
    </ol>
  );
}
