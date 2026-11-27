import { useId } from "react";

// Native disclosures sharing a name open one at a time.
export default function Accordion({ items, singleOpen = false }) {
  const groupName = useId();

  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q} name={singleOpen ? groupName : undefined}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
