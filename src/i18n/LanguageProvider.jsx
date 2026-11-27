import { createContext, useContext, useEffect, useState } from "react";
import { SCHOOL } from "../data/site.js";
import { spanish } from "./spanish.js";

const LanguageContext = createContext(null);
const STORAGE_KEY = "durham-orchestra-language";

function initialLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  const locale = language === "es" ? "es-US" : "en-US";

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "es" ? spanish[SCHOOL] ?? SCHOOL : SCHOOL;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Language selection still works when storage is unavailable.
    }
  }, [language]);

  function t(source, values = {}) {
    const message = language === "es" && Object.hasOwn(spanish, source) ? spanish[source] : source;
    return message.replace(/\{(\w+)\}/g, (placeholder, name) => values[name] ?? placeholder);
  }

  return (
    <LanguageContext.Provider value={{ language, locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
