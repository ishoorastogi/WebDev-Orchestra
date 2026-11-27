// numbered step cards
export default function Steps({ items }) {
  return (
    <ol className="grid grid-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((s, i) => (
        <li key={s.id} className="card">
          <span className="step-num">{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
