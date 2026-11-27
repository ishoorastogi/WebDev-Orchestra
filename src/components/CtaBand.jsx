import Button from "./Button.jsx";

// maroon cta strip
export default function CtaBand({ title, text, actions = [] }) {
  return (
    <div className="band">
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      <div className="btn-row">
        {/* 1st btn white, rest outlined */}
        {actions.map((a, i) => (
          <Button key={a.id} variant={i === 0 ? "light" : "ghost"} to={a.to} href={a.href}>{a.label}</Button>
        ))}
      </div>
    </div>
  );
}
