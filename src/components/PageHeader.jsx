import { Link } from "react-router-dom";

// maroon title band
export default function PageHeader({ title, intro }) {
  return (
    <header className="page-header">
      <div className="container">
        {/* breadcrumb */}
        <div className="crumbs">
          <Link to="/" style={{ color: "inherit" }}>Home</Link> / {title}
        </div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}
