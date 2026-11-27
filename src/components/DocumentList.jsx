import Button from "./Button.jsx";
import { SHARED_CONTENT } from "../data/site.js";

// pdf download rows
export default function DocumentList({ items }) {
  const { formatLabel, downloadLabel } = SHARED_CONTENT.documents;

  return (
    <div className="grid">
      {items.map((doc) => (
        <div className="doc-row" key={doc.id}>
          <span>{formatLabel}{" \u00a0 "}{doc.name}</span>
          <Button variant="outline" href={doc.href} download>{downloadLabel}</Button>
        </div>
      ))}
    </div>
  );
}
