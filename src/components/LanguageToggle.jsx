import { useState } from "react";
import { SHARED_CONTENT, SITE_METADATA } from "../data/site.js";

// en/es toggle — UI only for now. translation is not wired up yet.
// the buttons switch their active state but nothing on the page changes.
// TODO: add real translation in setLanguage() below.
//   (previous version used the google translate widget via a "googtrans" cookie + page reload)

export default function LanguageToggle() {
  const [lang, setLang] = useState(SITE_METADATA.language);
  const { label, options } = SHARED_CONTENT.language;

  function setLanguage(next) {
    setLang(next);
    // TODO: translation logic goes here
  }

  // en/es btns
  return (
    <div className="lang" role="group" aria-label={label}>
      {options.map(({ id, value, label: optionLabel }) => (
        <button key={id} aria-pressed={lang === value} onClick={() => setLanguage(value)}>{optionLabel}</button>
      ))}
    </div>
  );
}
