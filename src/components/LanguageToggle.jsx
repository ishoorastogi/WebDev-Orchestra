import { useState } from "react";

// en/es toggle — UI only for now. translation is not wired up yet.
// the buttons switch their active state but nothing on the page changes.
// TODO: add real translation in setLanguage() below.
//   (previous version used the google translate widget via a "googtrans" cookie + page reload)

export default function LanguageToggle() {
  const [lang, setLang] = useState("en");

  function setLanguage(next) {
    setLang(next);
    // TODO: translation logic goes here
  }

  // en/es btns
  return (
    <div className="lang" role="group" aria-label="Language">
      <button aria-pressed={lang === "en"} onClick={() => setLanguage("en")}>EN</button>
      <button aria-pressed={lang === "es"} onClick={() => setLanguage("es")}>ES</button>
      <button aria-pressed={lang === "idk"} onClick={() => setLanguage("idk")}>IDK</button>
    </div>
  );
}
