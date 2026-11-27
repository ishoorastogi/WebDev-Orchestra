import { SHARED_CONTENT } from "../data/site.js";

// yt embed, no cookies
export default function Video({ videoId, title }) {
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
        <div className="empty">{SHARED_CONTENT.media.videoPlaceholder.replace("{title}", () => title)}</div>
      )}
    </div>
  );
}
