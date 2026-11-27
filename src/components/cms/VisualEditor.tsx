"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteRenderer from "@/src/components/SiteRenderer.jsx";
import type { SiteContent, SiteSection } from "@/lib/content/schema";

type Selection = { kind: "page" } | { kind: "section"; id: string } | null;
type SaveStatus = "saved" | "dirty" | "saving" | "failed";
const labels: Record<SiteSection["type"], string> = {
  hero: "Hero", text: "Text", image: "Image", "image-text": "Image and text", "card-grid": "Card grid",
  documents: "Documents", events: "Events", timeline: "Timeline", checklist: "Checklist", cta: "Call to action", contact: "Contact", video: "Video",
};
const pageNames: Record<string, string> = {
  "": "Home", directors: "Directors", "new-to-orchestra": "New to Orchestra",
  "getting-an-instrument": "Getting an Instrument", "returning-members": "Returning Members", uil: "UIL",
};

function blankSection(type: SiteSection["type"]): SiteSection {
  return { id: crypto.randomUUID(), type, title: labels[type], body: "", image: "", alt: "", ctaLabel: "", ctaHref: "", items: [] };
}

export default function VisualEditor({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const contentRef = useRef(content);
  const [slug, setSlug] = useState("");
  const [selection, setSelection] = useState<Selection>(null);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [message, setMessage] = useState("");
  const [sectionType, setSectionType] = useState<SiteSection["type"]>("text");
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();
  const saveInFlight = useRef<Promise<boolean> | null>(null);

  const page = content.pages[slug];
  const selectedSection = useMemo(() => selection?.kind === "section" ? page?.sections.find((item) => item.id === selection.id) : null, [page, selection]);
  const previewHref = `/admin/preview?path=${encodeURIComponent(slug)}`;

  const changeContent = useCallback((next: SiteContent) => {
    contentRef.current = next;
    setContent(next);
    setStatus("dirty");
    setMessage("");
  }, []);

  const saveDraft = useCallback(async function persistDraft(snapshot = contentRef.current): Promise<boolean> {
    if (saveInFlight.current) {
      await saveInFlight.current;
      if (contentRef.current !== snapshot) return persistDraft(contentRef.current);
      return true;
    }
    setStatus("saving");
    const operation = (async () => {
      try {
        const response = await fetch("/api/admin/draft", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: snapshot }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Save failed.");
        if (contentRef.current === snapshot) setStatus("saved");
        return true;
      } catch (error) {
        if (contentRef.current === snapshot) {
          setStatus("failed");
          setMessage(error instanceof Error ? error.message : "Draft save failed.");
        } else setStatus("dirty");
        return false;
      }
    })();
    saveInFlight.current = operation;
    try { return await operation; }
    finally { if (saveInFlight.current === operation) saveInFlight.current = null; }
  }, []);

  const save = useCallback((snapshot = contentRef.current) => saveDraft(snapshot), [saveDraft]);

  useEffect(() => {
    if (status !== "dirty") return;
    const snapshot = content;
    const timer = window.setTimeout(() => { void save(snapshot); }, 900);
    return () => window.clearTimeout(timer);
  }, [content, save, status]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (status === "dirty" || status === "saving" || status === "failed") { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  useEffect(() => {
    const guardAdminNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || status === "saved") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith("/admin")) return;
      event.preventDefault();
      if (!window.confirm("Save pending website changes before leaving the editor?")) return;
      void save(contentRef.current).then((saved) => { if (saved) router.push(`${url.pathname}${url.search}${url.hash}`); });
    };
    document.addEventListener("click", guardAdminNavigation, true);
    return () => document.removeEventListener("click", guardAdminNavigation, true);
  }, [router, save, status]);

  const updatePage = (patch: Partial<typeof page>) => {
    if (!page) return;
    changeContent({ ...content, pages: { ...content.pages, [slug]: { ...page, ...patch } } });
  };
  const updateSection = (patch: Partial<SiteSection>) => {
    if (!page || !selectedSection) return;
    updatePage({ sections: page.sections.map((item) => item.id === selectedSection.id ? { ...item, ...patch } : item) });
  };
  const updateItem = (index: number, patch: Partial<SiteSection["items"][number]>) => {
    if (!selectedSection) return;
    updateSection({ items: selectedSection.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  };
  const addSection = () => {
    if (!page) return;
    const next = blankSection(sectionType);
    updatePage({ sections: [...page.sections, next] });
    setSelection({ kind: "section", id: next.id });
  };

  const moveSection = (direction: -1 | 1) => {
    if (!page || !selectedSection) return;
    const index = page.sections.findIndex((item) => item.id === selectedSection.id);
    const target = index + direction;
    if (target < 0 || target >= page.sections.length) return;
    const reordered = [...page.sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    updatePage({ sections: reordered });
  };

  const uploadFile = async (file?: File) => {
    if (!file || !selectedSection) return;
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("alt", selectedSection.alt);
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      if (file.type === "application/pdf") {
        updateSection({ items: [...selectedSection.items, { id: result.id, title: file.name, body: "", href: result.url, image: "", alt: "" }] });
      } else updateSection({ image: result.url, alt: selectedSection.alt || file.name });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally { setUploading(false); }
  };

  const publish = async () => {
    if (!window.confirm("Publish all pending website changes? They will become visible to everyone.")) return;
    setPublishing(true);
    let saved = true;
    while (contentRef.current && saved) {
      const snapshot = contentRef.current;
      saved = await save(snapshot);
      if (!saved || contentRef.current === snapshot) break;
    }
    if (!saved) { setPublishing(false); return; }
    try {
      const response = await fetch("/api/admin/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description: "Website changes" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Publishing failed.");
      setMessage("Changes published successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Publishing failed."); }
    finally { setPublishing(false); }
  };

  const uploadEventImage = async (index: number, file?: File) => {
    if (!file) return;
    setUploading(true); setMessage("");
    try {
      const formData = new FormData(); formData.set("file", file);
      formData.set("alt", contentRef.current.events[index]?.alt || "");
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      changeContent({ ...contentRef.current, events: contentRef.current.events.map((event, eventIndex) => eventIndex === index ? { ...event, image: result.url, alt: event.alt || file.name } : event) });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); }
  };

  const uploadItemImage = async (itemIndex: number, file?: File) => {
    if (!file || !selectedSection) return;
    setUploading(true); setMessage("");
    try {
      const formData = new FormData(); formData.set("file", file); formData.set("alt", selectedSection.items[itemIndex]?.alt || "");
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      updateItem(itemIndex, { image: result.url, alt: file.name });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); }
  };

  return <main className="cms-editor">
    <div className="cms-editor-heading"><div><h1>Edit your website</h1><p>Click a section in the preview to edit it. Changes save automatically and stay private until published.</p></div><div className="cms-editor-actions"><span className={`cms-save-status cms-${status}`} aria-live="polite">{status === "saved" ? "Saved" : status === "dirty" ? "Changes pending" : status === "saving" ? "Saving…" : "Save failed"}</span><Link className="btn btn-outline" href={previewHref}>Preview draft</Link><button className="btn btn-primary" disabled={publishing || status === "saving"} onClick={publish}>{publishing ? "Publishing…" : "Publish changes"}</button></div></div>
    {message && <p className={status === "failed" ? "cms-error" : "cms-notice"} role="status">{message}{status === "failed" && <button className="cms-inline-button" onClick={() => void save()}>Retry save</button>}</p>}
    <div className="cms-editor-grid">
      <section className="cms-preview-pane" aria-label="Website preview">
        <div className="cms-preview-bar"><label>Page <select value={slug} onChange={(event) => { setSlug(event.target.value); setSelection(null); }}>
          {Object.keys(pageNames).map((key) => <option value={key} key={key}>{pageNames[key]}</option>)}
        </select></label><Link href={previewHref} target="_blank">Open full preview ↗</Link></div>
        <header className="cms-site-header"><strong>{content.footer.school}</strong><nav aria-label="Website navigation preview">{content.nav.map((item) => <a key={item.id} href={item.href} onClick={(event) => event.preventDefault()}>{item.label}</a>)}</nav></header>
        {page && <SiteRenderer page={page} events={content.events} onSelect={setSelection} />}
        <footer className="cms-site-footer"><strong>{content.footer.school}</strong><span>{content.footer.description}</span><span>{content.footer.email}</span></footer>
      </section>
      <aside className="cms-edit-pane" aria-label="Content controls">
        <h2>{selection?.kind === "page" ? "Page settings" : selectedSection ? labels[selectedSection.type] : "Edit content"}</h2>
        {selection?.kind === "page" && page && <div className="cms-form">
          <label>Page title<input value={page.title} onChange={(event) => updatePage({ title: event.target.value })} /></label>
          <label>Introduction<textarea rows={4} value={page.intro} onChange={(event) => updatePage({ intro: event.target.value })} /></label>
        </div>}
        {selectedSection && <div className="cms-form">
          <div className="cms-section-order"><button type="button" onClick={() => moveSection(-1)}>Move up</button><button type="button" onClick={() => moveSection(1)}>Move down</button><button type="button" className="cms-danger" onClick={() => { updatePage({ sections: page.sections.filter((item) => item.id !== selectedSection.id) }); setSelection(null); }}>Remove section</button></div>
          <label>Section type<select value={selectedSection.type} onChange={(event) => updateSection({ type: event.target.value as SiteSection["type"] })}>{Object.entries(labels).map(([type, label]) => <option key={type} value={type}>{label}</option>)}</select></label>
          <label>Heading<input value={selectedSection.title} onChange={(event) => updateSection({ title: event.target.value })} /></label>
          <label>Text<textarea rows={6} value={selectedSection.body} onChange={(event) => updateSection({ body: event.target.value })} /></label>
          <label>Button label<input value={selectedSection.ctaLabel} onChange={(event) => updateSection({ ctaLabel: event.target.value })} /></label>
          <label>Button or video URL<input value={selectedSection.ctaHref} onChange={(event) => updateSection({ ctaHref: event.target.value })} placeholder="/directors or https://…" /></label>
          <label>Image URL<input value={selectedSection.image} onChange={(event) => updateSection({ image: event.target.value })} /></label>
          <label>Image description<input value={selectedSection.alt} onChange={(event) => updateSection({ alt: event.target.value })} /></label>
          <label>Upload an image or PDF<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" disabled={uploading} onChange={(event) => { void uploadFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
          {uploading && <p>Uploading…</p>}
          <h3>Cards, documents, and timeline items</h3>
          {selectedSection.items.map((item, index) => <fieldset className="cms-item-editor" key={item.id}><legend>Item {index + 1}</legend>
            <label>Title<input value={item.title} onChange={(event) => updateItem(index, { title: event.target.value })} /></label>
            <label>Text<textarea rows={3} value={item.body} onChange={(event) => updateItem(index, { body: event.target.value })} /></label>
            <label>Link<input value={item.href} onChange={(event) => updateItem(index, { href: event.target.value })} /></label>
            <label>Image URL<input value={item.image} onChange={(event) => updateItem(index, { image: event.target.value })} /></label>
            <label>Image description<input value={item.alt} onChange={(event) => updateItem(index, { alt: event.target.value })} /></label>
            <label>Upload an image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(event) => { void uploadItemImage(index, event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
            <button type="button" className="cms-danger" onClick={() => updateSection({ items: selectedSection.items.filter((_, itemIndex) => itemIndex !== index) })}>Remove item</button>
          </fieldset>)}
          <button type="button" className="btn btn-outline" onClick={() => updateSection({ items: [...selectedSection.items, { id: crypto.randomUUID(), title: "New item", body: "", href: "", image: "", alt: "" }] })}>Add item</button>
        </div>}
        {!selection && <p>Select a section in the website preview or choose a page title.</p>}
        <hr />
        <div className="cms-form"><label>Add a section<select value={sectionType} onChange={(event) => setSectionType(event.target.value as SiteSection["type"])}>{Object.entries(labels).map(([type, label]) => <option key={type} value={type}>{label}</option>)}</select></label><button type="button" className="btn btn-outline" onClick={addSection}>Add section to page</button></div>
      </aside>
    </div>
    <section className="cms-events-editor"><h2>Events</h2><p>Events here are part of the same draft and publish together with every page.</p>
      {content.events.map((event, index) => <fieldset className="cms-event" key={event.id}><legend>Event {index + 1}</legend><div className="cms-event-grid">
        <label>Title<input value={event.title} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, title: e.target.value } : x) })} /></label>
        <label>Date<input type="date" value={event.date} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, date: e.target.value } : x) })} /></label>
        <label>Start time<input type="time" value={event.startTime} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, startTime: e.target.value } : x) })} /></label>
        <label>End time<input type="time" value={event.endTime} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, endTime: e.target.value } : x) })} /></label>
        <label>Location<input value={event.location} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, location: e.target.value } : x) })} /></label>
        <label>Information link<input value={event.url} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, url: e.target.value } : x) })} /></label>
        <label>Event photo URL<input value={event.image} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, image: e.target.value } : x) })} /></label>
        <label>Photo description<input value={event.alt} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, alt: e.target.value } : x) })} /></label>
        <label>Upload event photo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(e) => { void uploadEventImage(index, e.target.files?.[0]); e.currentTarget.value = ""; }} /></label>
        <label className="cms-span">Description<textarea rows={3} value={event.description} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, description: e.target.value } : x) })} /></label>
        </div><div className="cms-section-order"><label><input type="checkbox" checked={event.visible} onChange={(e) => changeContent({ ...content, events: content.events.map((x, i) => i === index ? { ...x, visible: e.target.checked } : x) })} /> Show on public site</label><button type="button" onClick={() => { if (index > 0) { const events = [...content.events]; [events[index - 1], events[index]] = [events[index], events[index - 1]]; changeContent({ ...content, events }); } }}>Move up</button><button type="button" onClick={() => { if (index < content.events.length - 1) { const events = [...content.events]; [events[index + 1], events[index]] = [events[index], events[index + 1]]; changeContent({ ...content, events }); } }}>Move down</button><button className="cms-danger" type="button" onClick={() => changeContent({ ...content, events: content.events.filter((_, i) => i !== index) })}>Delete event</button></div>
      </fieldset>)}
      <button type="button" className="btn btn-outline" onClick={() => changeContent({ ...content, events: [...content.events, { id: crypto.randomUUID(), title: "", description: "", date: new Date().toISOString().slice(0, 10), startTime: "", endTime: "", location: "", image: "", alt: "", url: "", visible: true }] })}>Add event</button>
    </section>
    <section className="cms-settings"><details><summary>Navigation and footer settings</summary><div className="cms-settings-grid"><div><h3>Navigation</h3>{content.nav.map((item, index) => <fieldset className="cms-item-editor" key={item.id}><label>Label<input value={item.label} onChange={(e) => changeContent({ ...content, nav: content.nav.map((x, i) => i === index ? { ...x, label: e.target.value } : x) })} /></label><label>Link<input value={item.href} onChange={(e) => changeContent({ ...content, nav: content.nav.map((x, i) => i === index ? { ...x, href: e.target.value } : x) })} /></label></fieldset>)}</div><div><h3>Footer</h3><div className="cms-form"><label>School / program name<input value={content.footer.school} onChange={(e) => changeContent({ ...content, footer: { ...content.footer, school: e.target.value } })} /></label><label>Contact email<input type="email" value={content.footer.email} onChange={(e) => changeContent({ ...content, footer: { ...content.footer, email: e.target.value } })} /></label><label>Booster link<input value={content.footer.boosterUrl} onChange={(e) => changeContent({ ...content, footer: { ...content.footer, boosterUrl: e.target.value } })} /></label><label>Footer text<textarea rows={3} value={content.footer.description} onChange={(e) => changeContent({ ...content, footer: { ...content.footer, description: e.target.value } })} /></label></div></div></div></details></section>
  </main>;
}
