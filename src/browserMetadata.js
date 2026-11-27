export function applyBrowserMetadata({ title, language }, targetDocument = document) {
  targetDocument.title = title;
  targetDocument.documentElement.lang = language;
}
