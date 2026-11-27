import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SITE_METADATA } from "./src/data/site.js";

const htmlEntities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const htmlMetadata = { SITE_TITLE: SITE_METADATA.title, SITE_LANGUAGE: SITE_METADATA.language };

export default defineConfig({
  plugins: [
    react(),
    {
      name: "site-metadata",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html.replace(/%(SITE_TITLE|SITE_LANGUAGE)%/g, (_, key) =>
            htmlMetadata[key].replace(/[&<>"]/g, (character) => htmlEntities[character]),
          );
        },
      },
    },
  ],
});
