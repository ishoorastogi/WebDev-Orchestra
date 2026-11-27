import assert from "node:assert/strict";
import { test } from "node:test";
import { applyBrowserMetadata } from "../src/browserMetadata.js";
import { SITE_METADATA } from "../src/data/site.js";

test("browser metadata can be updated repeatedly with metadata from rendered content", () => {
  const document = { title: "Fallback title", documentElement: { lang: "en" } };
  applyBrowserMetadata(SITE_METADATA, document);
  assert.equal(document.title, SITE_METADATA.title);
  assert.equal(document.documentElement.lang, SITE_METADATA.language);

  applyBrowserMetadata({ title: "Título de prueba", language: "es" }, document);
  assert.equal(document.title, "Título de prueba");
  assert.equal(document.documentElement.lang, "es");
});
