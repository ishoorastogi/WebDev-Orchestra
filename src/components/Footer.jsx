import { Link } from "react-router-dom";
import { NAV, SCHOOL, BOOSTER_URL, DIRECTOR_EMAIL, HANDBOOK_LINK } from "../data/site.js";

export default function Footer() {
  const pages = [...NAV.filter((n) => n.to), HANDBOOK_LINK];
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          {/* contact col */}
          <h3>{SCHOOL}</h3>
          <a href={`mailto:${DIRECTOR_EMAIL}`}>{DIRECTOR_EMAIL}</a>
          <a href={BOOSTER_URL} target="_blank" rel="noopener noreferrer">Booster website</a>
        </div>
        <div>
          {/* sitemap col */}
          <h3>Pages</h3>
          {pages.map((p) => (
            <Link key={p.to} to={p.to}>{p.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
