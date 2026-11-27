// checkbox style list
export default function Checklist({ items }) {
  return (
    <ul className="checklist">
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
