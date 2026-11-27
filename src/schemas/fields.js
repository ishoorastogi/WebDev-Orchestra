import { z } from "zod";

export const requiredStringSchema = z.string().refine((value) => value.trim().length > 0, {
  error: "Enter non-empty text.",
});
export const optionalStringSchema = z.string().optional();
export const emailSchema = z.email({ error: "Enter a valid email address." });
export const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/, {
  error: "Use a stable ID with lowercase letters, numbers, hyphens, or underscores.",
});
const youtubeVideoIdPattern = /^[A-Za-z0-9_-]{11}$/;
export const youtubeVideoIdSchema = z.string().regex(youtubeVideoIdPattern, {
  error: "Enter an 11-character YouTube video ID.",
});
export const dateDisplaySchema = requiredStringSchema;

const invalidUrlCharacters = /[\s\\\u0000-\u001f\u007f]|%(?![a-f0-9]{2})/i;

function isHttpUrl(value) {
  if (!/^https?:\/\/[^/]/i.test(value) || invalidUrlCharacters.test(value)) return false;

  try {
    return Boolean(new URL(value).hostname);
  } catch {
    return false;
  }
}

function isRootRelativePath(value) {
  return value.startsWith("/") && !/^\/(?:\/|%2f|%5c)/i.test(value) && !invalidUrlCharacters.test(value);
}

function isAssetUrl(value) {
  return isHttpUrl(value) || (isRootRelativePath(value) && /^\/[^?#]/.test(value));
}

export const externalUrlSchema = z.string().refine(isHttpUrl, {
  error: "Enter a valid HTTP or HTTPS URL.",
});
export const internalRouteSchema = z.string().refine(isRootRelativePath, {
  error: "Enter a root-relative route such as /directors.",
});
export const assetUrlSchema = z.string().refine(isAssetUrl, {
  error: "Enter a root-relative asset path or a valid HTTP or HTTPS URL.",
});

// An empty source or video ID is a valid draft placeholder.
export const mediaSourceSchema = z.string().refine((value) => value === "" || isAssetUrl(value), {
  error: "Enter a root-relative asset path or a valid HTTP or HTTPS URL, or leave it empty in a draft.",
});
export const draftVideoIdSchema = z.string().refine((value) => value === "" || youtubeVideoIdPattern.test(value), {
  error: "Enter an 11-character YouTube video ID, or leave it empty in a draft.",
});

export const photoSchema = z.strictObject({
  src: mediaSourceSchema,
  alt: optionalStringSchema,
  caption: optionalStringSchema,
  label: requiredStringSchema,
});
export const documentSchema = z.strictObject({
  id: stableIdSchema,
  name: requiredStringSchema,
  href: assetUrlSchema,
});
export const ctaSchema = z.strictObject({ title: requiredStringSchema, label: requiredStringSchema });
export const faqEntrySchema = z.strictObject({
  id: stableIdSchema,
  q: requiredStringSchema,
  a: requiredStringSchema,
});
export const checklistEntrySchema = z.strictObject({
  id: stableIdSchema,
  text: requiredStringSchema,
});
export const timelineEntrySchema = z.strictObject({
  id: stableIdSchema,
  date: dateDisplaySchema,
  title: requiredStringSchema,
  text: requiredStringSchema,
});

export function uniqueIdCollection(itemSchema) {
  return z.array(itemSchema).superRefine((items, context) => {
    const indexes = new Map();
    for (const [index, { id }] of items.entries()) {
      if (indexes.has(id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `ID "${id}" is already used by item ${indexes.get(id) + 1} in this collection.`,
        });
      } else {
        indexes.set(id, index);
      }
    }
  });
}
