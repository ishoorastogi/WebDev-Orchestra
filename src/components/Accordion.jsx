import { useId } from "react";
import { useLanguage } from "../i18n/LanguageProvider.jsx";

// Native disclosures sharing a name open one at a time.
export default function Accordion({ items, singleOpen = false }) {
  const { t } = useLanguage();
  const groupName = useId();

  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q} name={singleOpen ? groupName : undefined}>
          <summary>{t(item.q)}</summary>
          <p>{t(item.a)}</p>
        </details>
      ))}
    </div>
  );
}
