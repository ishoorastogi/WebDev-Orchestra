"use client";

import Link from "next/link";
import Image from "next/image";

function SafeLink({ href, children, className = "", onClick }) {
  if (href?.startsWith("/")) return <Link className={className} href={href} onClick={onClick}>{children}</Link>;
  if (/^(https?:|mailto:|tel:)/i.test(href || "")) return <a className={className} href={href} onClick={onClick} target={/^https?:/i.test(href) ? "_blank" : undefined} rel={/^https?:/i.test(href) ? "noopener noreferrer" : undefined}>{children}</a>;
  return <span className={className}>{children}</span>;
}

function SiteSection({ section, onSelect, events = [] }) {
  const pick = () => onSelect?.({ kind: "section", id: section.id });
  const props = onSelect ? { onClick: (event) => { if (event.target.closest("a")) event.preventDefault(); pick(); }, className: "site-section cms-section" } : { className: "site-section" };
  const items = section.items || [];
  const image = section.image ? <Image src={section.image} alt={section.alt || ""} width={1200} height={700} unoptimized /> : <div className="photo" aria-label={section.alt || "Image placeholder"}>{section.alt || "Photo"}</div>;

  if (section.type === "hero") return <section {...props}><div className="section container"><div className="panel"><div><h1>{section.title}</h1><p>{section.body}</p>{section.ctaLabel && <SafeLink className="btn btn-light" href={section.ctaHref}>{section.ctaLabel}</SafeLink>}</div>{image}</div></div></section>;
  if (section.type === "image") return <section {...props}><div className="section container"><h2>{section.title}</h2>{items.length ? <div className="grid grid-4">{items.map((item) => <div className="photo" key={item.id}>{item.image ? <Image src={item.image} alt={item.alt || ""} width={640} height={420} unoptimized /> : <span>{item.title || "Photo"}</span>}</div>)}</div> : image}{section.body && <p>{section.body}</p>}</div></section>;
  if (section.type === "image-text") return <section {...props}><div className="section container"><h2>{section.title}</h2><div className="split"><div>{section.body.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div>{image}</div></div></section>;
  if (section.type === "card-grid") return <section {...props}><div className="section container"><h2>{section.title}</h2>{section.body && <p>{section.body}</p>}<div className="grid grid-3">{items.map((item) => <article className="card" key={item.id}><h3>{item.title}</h3><p>{item.body}</p>{item.image && <Image src={item.image} alt={item.alt} width={640} height={420} unoptimized />}{item.href && <SafeLink className="card-link" href={item.href}>Learn more →</SafeLink>}</article>)}</div></div></section>;
  if (section.type === "documents") return <section {...props}><div className="section container"><h2>{section.title}</h2>{items.length ? <div className="stack">{items.map((item) => <div className="doc-row" key={item.id}><span>{item.title}</span><SafeLink href={item.href}>Open document</SafeLink></div>)}</div> : <p>{section.body || "Documents will be posted here when available."}</p>}</div></section>;
  if (section.type === "timeline") return <section {...props}><div className="section container"><h2>{section.title}</h2><div className="timeline">{items.length ? items.map((item) => <article key={item.id}><div className="dot"/><h3>{item.title}</h3><p>{item.body}</p></article>) : <p>{section.body || "Details will be added here."}</p>}</div></div></section>;
  if (section.type === "checklist") return <section {...props}><div className="section container"><h2>{section.title}</h2><ul className="checklist">{(items.length ? items.map((item) => item.title) : section.body.split(";").map((x) => x.trim()).filter(Boolean)).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div></section>;
  if (section.type === "events") return <section {...props}><div className="section container"><h2>{section.title || "Upcoming events"}</h2>{events.filter((event) => event.visible).length ? <div className="grid grid-3">{events.filter((event) => event.visible).map((event) => <article className="card" key={event.id}>{event.image && <Image src={event.image} alt={event.alt || ""} width={640} height={360} unoptimized /> }<h3>{event.title}</h3><p><strong>{event.date}</strong>{event.startTime ? ` · ${event.startTime}${event.endTime ? `–${event.endTime}` : ""}` : ""}{event.location ? ` · ${event.location}` : ""}</p><p>{event.description}</p>{event.url && <SafeLink className="card-link" href={event.url}>Event details →</SafeLink>}</article>)}</div> : <p>{section.body || "No upcoming events are listed."}</p>}</div></section>;
  if (section.type === "cta") return <section {...props}><div className="section container"><div className="band"><div><h2>{section.title}</h2><p>{section.body}</p></div>{section.ctaLabel && <SafeLink className="btn btn-light" href={section.ctaHref}>{section.ctaLabel}</SafeLink>}</div></div></section>;
  if (section.type === "contact") return <section {...props}><div className="section container"><h2>{section.title}</h2><p>{section.body}</p>{items.map((item) => <article className="card" key={item.id}><h3>{item.title}</h3><p>{item.body}</p><SafeLink href={item.href}>{item.href}</SafeLink></article>)}</div></section>;
  if (section.type === "video") return <section {...props}><div className="section container"><h2>{section.title}</h2><p>{section.body}</p>{section.ctaHref && <div className="video"><iframe src={section.ctaHref} title={section.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation" allowFullScreen /></div>}</div></section>;
  return <section {...props}><div className="section container"><h2>{section.title}</h2>{section.body.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div></section>;
}

/** @param {{ page: any, onSelect?: (selection: any) => void, events?: any[] }} props */
export default function SiteRenderer({ page, onSelect, events = [] }) {
  return <article className={onSelect ? "cms-site-preview" : "cms-site-public"}>
    <header className={`page-header${onSelect ? " cms-page-editable" : ""}`} onClick={onSelect ? (event) => { if (event.target.closest("a")) event.preventDefault(); onSelect({ kind: "page" }); } : undefined}><div className="container"><div className="crumbs">Home / {page.title}</div><h1>{page.title}</h1>{page.intro && <p>{page.intro}</p>}</div></header>
    {onSelect && <div className="container cms-page-controls"><span>Click a section above to edit it.</span></div>}
    {page.sections.map((section) => <SiteSection key={section.id} section={section} onSelect={onSelect} events={events} />)}
  </article>;
}
