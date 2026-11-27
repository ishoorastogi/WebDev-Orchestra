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
        <div className="empty">Video coming soon: {title}</div>
      )}
    </div>
  );
}
