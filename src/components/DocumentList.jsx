import Button from "./Button.jsx";

// pdf download rows
export default function DocumentList({ items }) {
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
