import { useLanguage } from "../i18n/LanguageProvider.jsx";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="lang" role="group" aria-label={t("Language")} data-language={language}>
      <button type="button" lang="en" aria-label="English" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
      <button type="button" lang="es" aria-label="Español" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>ES</button>
    </div>
  );
}
