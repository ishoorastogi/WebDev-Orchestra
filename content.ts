import { readFile } from "node:fs/promises";

export async function getEvents() {
  const file = await readFile("data/events.json", "utf8");
  return JSON.parse(file);
}