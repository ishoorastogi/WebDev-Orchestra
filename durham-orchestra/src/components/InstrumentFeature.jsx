import Video from "./Video.jsx";

// video + text, flip alt
export default function InstrumentFeature({ name, text, videoId, flip }) {
  return (
    <div className={`split${flip ? " flip" : ""}`}>
      <Video videoId={videoId} title={`${name} listening example`} />
      <div>
        <h3>{name}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
