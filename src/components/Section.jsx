// std section wrapper
export default function Section({ title, id, children }) {
  return (
    <section className="section" id={id}>
      <div className="container">
        {/* optional heading */}
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </section>
  );
}
