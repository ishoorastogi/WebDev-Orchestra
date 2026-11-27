import Link from "next/link";

// card w/ optional link
export default function Card({ title, children, to, href, cta }) {
  // router link vs outside link
  let link = null;
  if (cta && to) link = <Link className="card-link" href={to}>{cta} &rarr;</Link>;
  if (cta && href) link = <a className="card-link" href={href} target="_blank" rel="noopener noreferrer">{cta} &rarr;</a>;
  return (
    <article className="card">
      <h3>{title}</h3>
      {children && <div>{children}</div>}
      {link}
    </article>
  );
}
