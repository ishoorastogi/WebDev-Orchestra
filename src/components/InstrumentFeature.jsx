import Video from "./Video.jsx";
import { SHARED_CONTENT } from "../data/site.js";

// video + text, flip alt
export default function InstrumentFeature({ name, text, videoId, flip }) {
  const videoTitle = SHARED_CONTENT.media.listeningExampleTitle.replace("{instrument}", () => name);

  return (
    <div className={`split${flip ? " flip" : ""}`}>
      <Video videoId={videoId} title={videoTitle} />
      <div>
        <h3>{name}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
