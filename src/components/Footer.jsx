import Link from "next/link";
import { NAV, SCHOOL, BOOSTER_URL, DIRECTOR_EMAIL } from "../data/site.js";

export default function Footer({ content }) {
  // top-level links only
  const pages = content?.nav || NAV.filter((n) => n.to).map((n) => ({ id: n.to, label: n.label, href: n.to }));
  const school = content?.footer?.school || SCHOOL;
  const email = content?.footer?.email || DIRECTOR_EMAIL;
  const boosterUrl = content?.footer?.boosterUrl || BOOSTER_URL;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          {/* contact col */}
          <h3>{school}</h3>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {boosterUrl && <a href={boosterUrl} target="_blank" rel="noopener noreferrer">Booster website</a>}
          {content?.footer?.description && <p>{content.footer.description}</p>}
        </div>
        <div>
          {/* sitemap col */}
          <h3>Pages</h3>
          {pages.map((p) => (
            <Link key={p.id || p.href} href={p.href || p.to}>{p.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
