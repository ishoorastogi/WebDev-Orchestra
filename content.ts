import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getEvents() {
  const file = await readFile(join(process.cwd(), "data", "events.json"), "utf8");
  return JSON.parse(file);
}
