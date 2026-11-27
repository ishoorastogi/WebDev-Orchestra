import { Link } from "react-router-dom";
import { SHARED_CONTENT } from "../data/site.js";

// maroon title band
export default function PageHeader({ title, intro }) {
  return (
    <header className="page-header">
      <div className="container">
        {/* breadcrumb */}
        <div className="crumbs">
          <Link to="/" style={{ color: "inherit" }}>{SHARED_CONTENT.navigation.homeBreadcrumb}</Link> / {title}
        </div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}
