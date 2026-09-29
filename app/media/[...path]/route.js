import fs from "node:fs/promises";
import path from "node:path";
import { getUploadDir, mimeFor } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { path: segments = [] } = await params;
  const rel = segments.join("/");

  // Tolak traversal
  if (!rel || rel.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(getUploadDir(), rel);
  const root = path.resolve(getUploadDir());
  if (!path.resolve(filePath).startsWith(root)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(filePath);
    return new Response(data, {
      headers: {
        "Content-Type": mimeFor(filePath),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
