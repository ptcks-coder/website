import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import { SETTING_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await prisma.setting.findMany();
  const map = {};
  for (const row of rows) map[row.key] = row.value ?? "";
  for (const [key, cfg] of Object.entries(SETTING_KEYS)) {
    if (!(key in map)) map[key] = cfg.default;
  }
  return NextResponse.json({ settings: map });
}

export async function POST(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const entries = Object.entries(SETTING_KEYS);
  await prisma.$transaction(
    entries.map(([key, cfg]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(body[key] ?? "") },
        create: { key, value: String(body[key] ?? cfg.default ?? ""), section: cfg.section }
      })
    )
  );

  revalidateTag("settings", "max");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
