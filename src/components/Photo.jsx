import { SHARED_CONTENT } from "../data/site.js";

// display-only photo. right-click, drag, and text selection are blocked to discourage casual saving.
// this cannot fully stop downloads, so also use resized images and check the district's media-release policy.
export default function Photo({ src, alt = "", caption, label = SHARED_CONTENT.media.photoPlaceholder, height = 220, className = "" }) {
  // no right-click or drag
  const photo = (
    <div className={`photo ${className}`} style={{ height }} onContextMenu={(e) => e.preventDefault()}>
      {src ? <img src={src} alt={alt} draggable={false} loading="lazy" /> : <span>{label}</span>}
      <span className="photo-guard" aria-hidden="true" />
    </div>
  );

  return caption ? (
    <figure style={{ margin: 0 }}>
      {photo}
      <figcaption>{caption}</figcaption>
    </figure>
  ) : photo;
}
