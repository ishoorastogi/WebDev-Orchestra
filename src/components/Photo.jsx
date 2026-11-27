import { useLanguage } from "../i18n/LanguageProvider.jsx";
// display-only photo. right-click, drag, and text selection are blocked to discourage casual saving.
// this cannot fully stop downloads, so also use resized images and check the district's media-release policy.
export default function Photo({ src, alt = "", label = "Photo", height = 220, className = "" }) {
  const { t } = useLanguage();
  // no right-click or drag
  return (
    <div className={`photo ${className}`} style={{ height }} onContextMenu={(e) => e.preventDefault()}>
      {src ? <img src={src} alt={t(alt)} draggable={false} loading="lazy" /> : <span>{t(label)}</span>}
      <span className="photo-guard" aria-hidden="true" />
    </div>
  );
}
