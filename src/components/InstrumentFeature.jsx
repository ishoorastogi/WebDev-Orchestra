import { useLanguage } from "../i18n/LanguageProvider.jsx";
import Video from "./Video.jsx";

// video + text, flip alt
export default function InstrumentFeature({ name, text, videoId, flip }) {
  const { t } = useLanguage();
  return (
    <div className={`split${flip ? " flip" : ""}`}>
      <Video videoId={videoId} title={t("{name} listening example", { name: t(name) })} />
      <div>
        <h3>{t(name)}</h3>
        <p>{t(text)}</p>
      </div>
    </div>
  );
}
