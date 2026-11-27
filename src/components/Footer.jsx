import { Link } from "react-router-dom";
import { FOOTER_CONTENT, NAV } from "../data/site.js";

export default function Footer() {
  const { heading, email, boosterLabel, boosterUrl, pagesHeading } = FOOTER_CONTENT;
  // top-level links only
  const pages = NAV.filter((n) => n.to);
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          {/* contact col */}
          <h3>{heading}</h3>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={boosterUrl} target="_blank" rel="noopener noreferrer">{boosterLabel}</a>
        </div>
        <div>
          {/* sitemap col */}
          <h3>{pagesHeading}</h3>
          {pages.map((p) => (
            <Link key={p.id} to={p.to}>{p.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
