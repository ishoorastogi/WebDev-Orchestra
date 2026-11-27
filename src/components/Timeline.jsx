// dates in a row
export default function Timeline({ items }) {
  return (
    <ol className="timeline" style={{ listStyle: "none", margin: 0 }}>
      {items.map((item) => (
        <li key={item.title}>
          <div className="dot" />
          <div className="date">{item.date}</div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
