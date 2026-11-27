import assert from "node:assert/strict";
import { test } from "node:test";
import * as site from "../src/data/site.js";
import { sectionSchemas, siteContentSchema, validateContentSection, validateSiteContent } from "../src/schemas/index.js";

const content = { ...site };
const cloneContent = () => structuredClone(content);
const publication = { mode: "publication" };

function assertFieldError(result, path, messagePattern) {
  assert.equal(result.success, false);
  const error = result.errors.find((issue) => JSON.stringify(issue.path) === JSON.stringify(path));
  assert.ok(error, `Expected an error at ${path.join(".")}. Received ${JSON.stringify(result.errors)}`);
  assert.match(error.message, messagePattern);
}

test("the root schema covers all 21 exports and accepts the existing draft", () => {
  assert.equal(Object.keys(content).length, 21);
  assert.deepEqual(Object.keys(sectionSchemas).sort(), Object.keys(content).sort());
  assert.deepEqual(siteContentSchema.parse(content), content);
  assert.deepEqual(validateSiteContent(content), { success: true, data: content });
});

test("every section can be validated independently", () => {
  for (const [section, value] of Object.entries(content)) {
    assert.deepEqual(validateContentSection(section, value), { success: true, data: value }, section);
  }
  assertFieldError(validateContentSection("SITE_METADATA", { title: "", language: "en" }), ["SITE_METADATA", "title"], /non-empty/i);
});

test("missing sections and missing required nested fields have field paths", () => {
  const draft = cloneContent();
  delete draft.UIL_PAGE;
  delete draft.HOME_PAGE.hero.title;

  const result = validateSiteContent(draft);
  assertFieldError(result, ["UIL_PAGE"], /expected object/i);
  assertFieldError(result, ["HOME_PAGE", "hero", "title"], /expected string/i);
});

test("incorrect field types and unrecognized keys are rejected", () => {
  const draft = cloneContent();
  draft.RETURNING_DATES[0].date = 42;
  draft.HOME_PAGE.hero.unexpected = true;

  const result = validateSiteContent(draft);
  assertFieldError(result, ["RETURNING_DATES", 0, "date"], /expected string/i);
  assertFieldError(result, ["HOME_PAGE", "hero"], /unrecognized key.*unexpected/i);
});

test("invalid emails are rejected at their corresponding paths", () => {
  const draft = cloneContent();
  draft.DIRECTORS[0].email = "not-an-email";
  draft.FOOTER_CONTENT.email = "director@example";

  const result = validateSiteContent(draft);
  assertFieldError(result, ["DIRECTORS", 0, "email"], /valid email address/i);
  assertFieldError(result, ["FOOTER_CONTENT", "email"], /valid email address/i);
});

test("invalid external URLs, internal routes, and asset paths are rejected", () => {
  const draft = cloneContent();
  draft.BOOSTER_URL = "https://";
  draft.NAV[0].to = "directors";
  draft.DOCUMENTS[0].href = "forms/form-1.pdf";
  draft.HOME_PAGE.hero.photo.src = "/photos/bad%xx.jpg";

  const result = validateSiteContent(draft);
  assertFieldError(result, ["BOOSTER_URL"], /HTTP or HTTPS URL/i);
  assertFieldError(result, ["NAV", 0, "to"], /root-relative route/i);
  assertFieldError(result, ["DOCUMENTS", 0, "href"], /asset path/i);
  assertFieldError(result, ["HOME_PAGE", "hero", "photo", "src"], /asset path/i);
});

test("unsafe protocols and disguised network paths are rejected everywhere links are accepted", () => {
  const unsafe = ["javascript:alert(1)", "data:text/html,unsafe", "//test.invalid/file", "/\\test.invalid/file", "/%2Ftest.invalid/file"];
  for (const link of unsafe) {
    const draft = cloneContent();
    draft.BOOSTER_URL = link;
    draft.FOOTER_CONTENT.boosterUrl = link;
    draft.NAV[0].to = link;
    draft.RENTALS[0].href = link;
    draft.DOCUMENTS[0].href = link;
    draft.SHARED_CONTENT.navigation.logo.src = link;
    draft.HOME_PAGE.hero.photo.src = link;

    const result = validateSiteContent(draft);
    assertFieldError(result, ["BOOSTER_URL"], /URL/i);
    assertFieldError(result, ["FOOTER_CONTENT", "boosterUrl"], /URL/i);
    assertFieldError(result, ["NAV", 0, "to"], /route/i);
    assertFieldError(result, ["RENTALS", 0, "href"], /URL/i);
    assertFieldError(result, ["DOCUMENTS", 0, "href"], /asset path/i);
    assertFieldError(result, ["SHARED_CONTENT", "navigation", "logo", "src"], /asset path/i);
    assertFieldError(result, ["HOME_PAGE", "hero", "photo", "src"], /asset path/i);
  }
});

test("valid HTTP URLs and existing root-relative paths are supported", () => {
  const draft = cloneContent();
  draft.BOOSTER_URL = "http://orchestra.test/booster";
  draft.NAV[0].to = "/directors?from=home#main";
  draft.HOME_PAGE.hero.photo.src = "/photos/group%20photo.jpg";
  draft.DOCUMENTS[1].href = "https://orchestra.test/forms/permission.pdf";

  assert.deepEqual(validateSiteContent(draft), { success: true, data: draft });
});

test("YouTube IDs must have exactly 11 valid characters when provided", () => {
  const video = content.INSTRUMENTS[0];
  for (const videoId of ["too-short", "1234567890!", "https://youtu.be/AbcDeFgH_-1"]) {
    assertFieldError(validateContentSection("INSTRUMENTS", [{ ...video, videoId }]), ["INSTRUMENTS", 0, "videoId"], /11-character YouTube/i);
  }
  assert.equal(validateContentSection("INSTRUMENTS", [{ ...video, videoId: "AbcDeFgH_-1" }], publication).success, true);
});

test("duplicate IDs are rejected in each top-level and nested collection", () => {
  const draft = cloneContent();
  const paths = [
    ["NAV"], ["DIRECTORS"], ["INSTRUMENTS"], ["INSTRUMENT_FAQ"], ["RENTALS"],
    ["INSTRUMENT_STEPS"], ["RETURNING_DATES"], ["UIL_DATES"], ["DOCUMENTS"],
    ["DIRECTORS_PAGE", "profiles"], ["HOME_PAGE", "gallery", "photos"],
    ["GETTING_AN_INSTRUMENT_PAGE", "faq", "items"], ["RETURNING_MEMBERS_PAGE", "reenrollment", "checklist"],
    ["SHARED_CONTENT", "language", "options"], ["UIL_PAGE", "otherGroups", "groups"],
  ];
  for (const path of paths) {
    const items = path.reduce((value, key) => value[key], draft);
    items[1].id = items[0].id;
  }
  draft.NAV.push({ id: "dropdown-test", label: "Links", children: [draft.NAV[2], { ...draft.NAV[3], id: draft.NAV[2].id }] });

  const result = validateSiteContent(draft);
  for (const path of paths) assertFieldError(result, [...path, 1, "id"], /already used/i);
  assertFieldError(result, ["NAV", 6, "children", 1, "id"], /already used/i);
});

test("stable IDs survive label edits and allow duplicate display names", () => {
  const draft = cloneContent();
  const ids = draft.DOCUMENTS.map(({ id }) => id);
  draft.DOCUMENTS.forEach((item) => { item.name = "Same display name"; });
  const result = validateContentSection("DOCUMENTS", draft.DOCUMENTS);

  assert.equal(result.success, true);
  assert.deepEqual(result.data.map(({ id }) => id), ids);
  assertFieldError(validateContentSection("DOCUMENTS", [{ ...draft.DOCUMENTS[0], id: "Invalid id" }]), ["DOCUMENTS", 0, "id"], /stable ID/i);
});

test("unknown content sections cannot resolve inherited object properties", () => {
  for (const name of ["MISSING_SECTION", "__proto__", "constructor", "toString"]) {
    assertFieldError(validateContentSection(name, {}), [name], /unknown content section/i);
  }
});

test("existing dates, copy, example domains, and empty media remain valid draft data", () => {
  assert.deepEqual(validateContentSection("RETURNING_DATES", site.RETURNING_DATES).data, site.RETURNING_DATES);
  assert.equal(validateContentSection("DIRECTOR_EMAIL", site.DIRECTOR_EMAIL).data, "director@example.org");
  assert.equal(validateContentSection("INSTRUMENTS", site.INSTRUMENTS).data[0].videoId, "");
  assert.equal(validateContentSection("HOME_PAGE", site.HOME_PAGE).data.hero.photo.src, "");
});

test("publication rejects unresolved placeholders with the same paths for sections and the root", () => {
  const result = validateSiteContent(content, publication);
  assertFieldError(result, ["DIRECTOR_EMAIL"], /example email/i);
  assertFieldError(result, ["BOOSTER_URL"], /example URL/i);
  assertFieldError(result, ["RENTALS", 0, "name"], /placeholder rental provider/i);
  assertFieldError(result, ["RENTALS", 1, "name"], /placeholder rental provider/i);
  assertFieldError(result, ["RETURNING_DATES", 0, "date"], /bracketed placeholder/i);
  assertFieldError(result, ["INSTRUMENTS", 0, "videoId"], /YouTube/i);
  assertFieldError(result, ["HOME_PAGE", "hero", "photo", "src"], /media source/i);
  assertFieldError(result, ["SHARED_CONTENT", "navigation", "logo", "src"], /media source/i);
  const section = validateContentSection("UIL_PAGE", site.UIL_PAGE, publication);
  assert.deepEqual(section.errors, result.errors.filter(({ path }) => path[0] === "UIL_PAGE"));
  assertFieldError(section, ["UIL_PAGE", "overview", "text"], /bracketed placeholder/i);
});

test("publication accepts resolved sections with display dates and optional empty captions", () => {
  const event = { ...site.RETURNING_DATES[0], date: "August 12 at 6 p.m.", text: "Bring your instrument." };
  assert.equal(validateContentSection("RETURNING_DATES", [event], publication).success, true);
  const uil = structuredClone(site.UIL_PAGE);
  uil.overview.text = "Learn about the contest.";
  uil.overview.photo.src = "/photos/contest[1].jpg";
  uil.otherGroups.groups = [];
  assert.equal(validateContentSection("UIL_PAGE", uil, publication).success, true);
});

test("JSON serialization round-trips all data and reports an explicit undefined optional field", () => {
  const draft = JSON.parse(JSON.stringify(content));
  assert.deepEqual(validateSiteContent(draft), { success: true, data: content });
  delete draft.HOME_PAGE.hero.photo.caption;
  assert.equal(validateSiteContent(draft).success, true);
  draft.HOME_PAGE.hero.photo.caption = undefined;
  assertFieldError(validateSiteContent(draft), ["HOME_PAGE", "hero", "photo", "caption"], /round-trip through JSON/i);
});

test("metadata checks the document language tag", () => {
  assertFieldError(validateContentSection("SITE_METADATA", { title: "Title", language: "not a language" }), ["SITE_METADATA", "language"], /language tag/i);
  assert.equal(validateContentSection("SITE_METADATA", { title: "Title", language: "en-US" }).success, true);
});
