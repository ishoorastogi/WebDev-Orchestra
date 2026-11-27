import { z } from "zod";

const safeLink = z.string().max(2048).refine((value) => {
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.includes("\\") && !/[\u0000-\u001f]/.test(value);
  try {
    return ["http:", "https:", "mailto:", "tel:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, "Use an internal path or a valid http(s), mailto, or tel URL.");
const safeMedia = z.string().max(2048).refine((value) => {
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.includes("\\") && !/[\u0000-\u001f]/.test(value);
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Use an internal media path or a secure https URL.");

export const SiteItemSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().max(200),
  body: z.string().max(5000).default(""),
  href: safeLink.default(""),
  image: safeMedia.default(""),
  alt: z.string().max(300).default(""),
});

export const SectionSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(["hero", "text", "image", "image-text", "card-grid", "documents", "events", "timeline", "checklist", "cta", "contact", "video"]),
  title: z.string().max(200).default(""),
  body: z.string().max(10000).default(""),
  image: safeMedia.default(""),
  alt: z.string().max(300).default(""),
  ctaLabel: z.string().max(100).default(""),
  ctaHref: safeLink.default(""),
  items: z.array(SiteItemSchema).max(30).default([]),
}).superRefine((section, context) => {
  if (section.type !== "video" || !section.ctaHref) return;
  try {
    const hostname = new URL(section.ctaHref).hostname.toLowerCase();
    const allowed = ["youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com", "player.vimeo.com"];
    if (!allowed.includes(hostname)) context.addIssue({ code: "custom", path: ["ctaHref"], message: "Use an approved YouTube or Vimeo video embed URL." });
  } catch {
    context.addIssue({ code: "custom", path: ["ctaHref"], message: "Enter a valid video URL." });
  }
});

export const PageSchema = z.object({
  title: z.string().min(1).max(200),
  intro: z.string().max(2000).default(""),
  sections: z.array(SectionSchema).max(40),
});

export const EventSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(""),
  date: z.string().date(),
  startTime: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.").default(""),
  endTime: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.").default(""),
  location: z.string().max(500).default(""),
  image: safeMedia.default(""),
  alt: z.string().max(300).default(""),
  url: safeLink.default(""),
  visible: z.boolean().default(true),
});

export const SiteContentSchema = z.object({
  nav: z.array(z.object({ id: z.string().max(80), label: z.string().min(1).max(100), href: safeLink })).max(20),
  footer: z.object({
    school: z.string().max(200),
    email: z.string().email().or(z.literal("")),
    boosterUrl: safeLink,
    description: z.string().max(2000),
  }),
  pages: z.record(z.string().regex(/^[a-z0-9-]*$/), PageSchema).refine((pages) => Object.keys(pages).length <= 20, "A site can contain up to 20 pages."),
  events: z.array(EventSchema).max(200),
});

export type SiteContent = z.infer<typeof SiteContentSchema>;
export type SitePage = z.infer<typeof PageSchema>;
export type SiteSection = z.infer<typeof SectionSchema>;
