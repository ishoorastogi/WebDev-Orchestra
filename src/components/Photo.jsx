"use client";

import Image from "next/image";

// display-only photo. right-click, drag, and text selection are blocked to discourage casual saving.
// this cannot fully stop downloads, so also use resized images and check the district's media-release policy.
export default function Photo({ src, alt = "", label = "Photo", height = 220, className = "" }) {
  // no right-click or drag
  return (
    <div className={`photo ${className}`} style={{ height }} onContextMenu={(e) => e.preventDefault()}>
      {src ? <Image src={src} alt={alt} width={1200} height={height} unoptimized draggable={false} /> : <span>{label}</span>}
      <span className="photo-guard" aria-hidden="true" />
    </div>
  );
}
