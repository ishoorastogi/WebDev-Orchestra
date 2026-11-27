import { useLanguage } from "../i18n/LanguageProvider.jsx";
// yt embed, no cookies
export default function Video({ videoId, title }) {
  const { t } = useLanguage();
  return (
    <div className="video">
      {/* placeholder if no id */}
      {videoId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="empty">{t("Video coming soon: {title}", { title })}</div>
      )}
    </div>
  );
}
