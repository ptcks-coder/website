import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ALLOWED = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"],
  [".mp4", "video/mp4"]
]);

export function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

function sanitizeName(name) {
  const base = String(name || "file").toLowerCase();
  const safe = base.replace(/[^a-z0-9.\-_]/g, "-").replace(/-+/g, "-");
  return safe.slice(-80) || "file";
}

/**
 * Simpan buffer upload ke UPLOAD_DIR, kembalikan URL publik (/media/xxx).
 * Dipakai oleh handler next-admin dan endpoint upload editor.
 */
export async function saveUpload(buffer, originalName) {
  const safe = sanitizeName(originalName);
  const ext = path.extname(safe).toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new Error(`Tipe file tidak didukung: ${ext || "tanpa ekstensi"}`);
  }
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${safe}`;
  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/media/${filename}`;
}

export function mimeFor(filename) {
  return ALLOWED.get(path.extname(filename).toLowerCase()) || "application/octet-stream";
}
