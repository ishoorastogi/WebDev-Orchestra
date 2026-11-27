import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getDirector } from "@/lib/auth/director";
import { hasSameOrigin } from "@/lib/auth/origin";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"],
  ["image/avif", "avif"], ["application/pdf", "pdf"],
]);
const maxBytes = 10 * 1024 * 1024;

async function fileMatchesType(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  switch (file.type) {
    case "image/jpeg": return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png": return bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
    case "image/webp": return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    case "image/avif": return String.fromCharCode(...bytes.slice(4, 12)).includes("ftyp") && String.fromCharCode(...bytes.slice(8, 16)).includes("avif");
    case "application/pdf": return String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
    default: return false;
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > maxBytes + 65536) return NextResponse.json({ error: "Files must be 10 MB or smaller." }, { status: 413 });
  const director = await getDirector();
  if (!director) return NextResponse.json({ error: "Director access required." }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ error: "Use a JPG, PNG, WebP, AVIF, or PDF file." }, { status: 415 });
  if (file.size <= 0 || file.size > maxBytes) return NextResponse.json({ error: "Files must be 10 MB or smaller." }, { status: 413 });
  if (!await fileMatchesType(file)) return NextResponse.json({ error: "The file contents do not match its file type." }, { status: 415 });

  const id = randomUUID();
  const path = `${id}.${extension}`;
  const { error: uploadError } = await director.supabase.storage.from("orchestra-media").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return NextResponse.json({ error: "Upload failed. Check the CMS migration and try again." }, { status: 500 });
  const altText = String(form?.get("alt") || "").replace(/[\u0000-\u001f]/g, " ").slice(0, 300);
  const { error: insertError } = await director.supabase.from("media_assets").insert({
    id, storage_path: path, original_filename: file.name.replace(/[\\/\u0000-\u001f]/g, "_").slice(0, 200),
    content_type: file.type, size_bytes: file.size, alt_text: altText, uploaded_by: director.user.id,
  });
  if (insertError) {
    await director.supabase.storage.from("orchestra-media").remove([path]);
    return NextResponse.json({ error: "The file could not be registered in the media library." }, { status: 500 });
  }
  return NextResponse.json({ id, url: `/api/media/${id}`, filename: file.name });
}
