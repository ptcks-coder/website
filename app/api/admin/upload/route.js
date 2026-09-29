import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

export async function POST(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Tidak ada file." }, { status: 400 });
  }
  const isVideo = String(file.type || "").startsWith("video/") || /\.mp4$/i.test(file.name || "");
  const maxBytes = isVideo ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: isVideo ? "Ukuran video maksimal 30MB." : "Ukuran file maksimal 10MB." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUpload(buffer, file.name);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
