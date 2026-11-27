import { sectionSchemas, siteContentSchema } from "./siteContent.js";

export { sectionSchemas, siteContentSchema };

const exampleDomain = /(?:^|\.)example\.(com|net|org)\.?$/i;
const bracketedPlaceholder = /\[[^\[\]\r\n]+\]/;
const urlFields = new Set(["BOOSTER_URL", "boosterUrl", "href", "src"]);
const rentalNamePlaceholders = new Set(["company", "compaany"]);

function publicationMessage(value, path) {
  const field = path.at(-1);
  if (field === "videoId" && value === "") return "Add a YouTube video ID before publishing.";
  if (field === "src" && value === "") return "Add a media source before publishing.";

  if (field === "email" || field === "DIRECTOR_EMAIL") {
    const domain = value.slice(value.lastIndexOf("@") + 1);
    return exampleDomain.test(domain) ? "Replace the example email address before publishing." : undefined;
  }
  if (urlFields.has(field)) {
    if (value.startsWith("/") || !exampleDomain.test(new URL(value).hostname)) return undefined;
    return "Replace the example URL before publishing.";
  }
  if (path[0] === "RENTALS" && field === "name" && rentalNamePlaceholders.has(value.trim().toLowerCase())) {
    return "Replace the placeholder rental provider name before publishing.";
  }
  if (field !== "to" && bracketedPlaceholder.test(value)) return "Replace the bracketed placeholder before publishing.";
}

function collectContentErrors(value, path, mode, errors) {
  if (typeof value === "string" && mode === "publication") {
    const message = publicationMessage(value, path);
    if (message) errors.push({ path, message });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectContentErrors(item, [...path, index], mode, errors));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collectContentErrors(item, [...path, key], mode, errors);
    }
  } else if (value === undefined) {
    errors.push({ path, message: "Omit optional fields without a value so the content can round-trip through JSON." });
  }
}

function validate(schema, content, path, { mode = "draft" } = {}) {
  if (mode !== "draft" && mode !== "publication") {
    return { success: false, errors: [{ path: ["mode"], message: 'Use "draft" or "publication" as the validation mode.' }] };
  }

  const result = schema.safeParse(content);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({ path: [...path, ...issue.path], message: issue.message })),
    };
  }

  const errors = [];
  collectContentErrors(result.data, path, mode, errors);
  return errors.length ? { success: false, errors } : result;
}

export function validateSiteContent(content, options) {
  return validate(siteContentSchema, content, [], options);
}

export function validateContentSection(section, content, options) {
  if (typeof section !== "string" || !Object.hasOwn(sectionSchemas, section)) {
    return {
      success: false,
      errors: [{ path: typeof section === "string" ? [section] : [], message: "Unknown content section." }],
    };
  }
  return validate(sectionSchemas[section], content, [section], options);
}
