import Button from "./Button.jsx";

// pdf download rows
export default function DocumentList({ items }) {
  if (!items.length) return <p>Documents will be posted here when available.</p>;
  return (
    <div className="grid">
      {items.map((doc) => (
        <div className="doc-row" key={doc.name}>
          <span>PDF &nbsp; {doc.name}</span>
          <Button variant="outline" href={doc.href} download>Download</Button>
        </div>
      ))}
    </div>
  );
}
