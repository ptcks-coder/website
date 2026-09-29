import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

function startOfDay(offsetDays = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offsetDays);
  return d;
}

export async function GET(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = startOfDay(0);
  const week = startOfDay(6);
  const month = startOfDay(29);

  const [
    viewsToday,
    views7d,
    views30d,
    dailyRows,
    topPages,
    topReferrers,
    pendingPosts,
    totalPosts,
    publishedPosts,
    newRegistrations,
    unreadMessages,
    upcomingEvents,
    recentPosts
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: week } } }),
    prisma.pageView.count({ where: { createdAt: { gte: month } } }),
    prisma.$queryRaw`
      SELECT DATE(createdAt) AS day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
      FROM PageView
      WHERE createdAt >= ${month}
      GROUP BY DATE(createdAt)
      ORDER BY day ASC
    `,
    prisma.$queryRaw`
      SELECT path, COUNT(*) AS views
      FROM PageView
      WHERE createdAt >= ${month}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 8
    `,
    prisma.$queryRaw`
      SELECT referrer, COUNT(*) AS views
      FROM PageView
      WHERE createdAt >= ${month} AND referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer
      ORDER BY views DESC
      LIMIT 6
    `,
    prisma.post.count({ where: { status: "PENDING" } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.registration.count({ where: { status: "BARU" } }),
    prisma.message.count({ where: { isRead: false } }),
    prisma.event.count({ where: { published: true, startAt: { gte: new Date() } } }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        author: { select: { name: true } }
      }
    })
  ]);

  // Lengkapi 30 hari agar grafik kontinu
  const dayMap = new Map(
    dailyRows.map((r) => [
      new Date(r.day).toISOString().slice(0, 10),
      { views: Number(r.views), visitors: Number(r.visitors) }
    ])
  );
  const chart = [];
  for (let i = 29; i >= 0; i--) {
    const d = startOfDay(i);
    const key = d.toISOString().slice(0, 10);
    chart.push({ date: key, views: dayMap.get(key)?.views || 0, visitors: dayMap.get(key)?.visitors || 0 });
  }

  return NextResponse.json({
    stats: {
      viewsToday,
      views7d,
      views30d,
      pendingPosts,
      totalPosts,
      publishedPosts,
      newRegistrations,
      unreadMessages,
      upcomingEvents
    },
    chart,
    topPages: topPages.map((r) => ({ path: r.path, views: Number(r.views) })),
    topReferrers: topReferrers.map((r) => ({ referrer: r.referrer, views: Number(r.views) })),
    recentPosts,
    role: user.role,
    name: user.name
  });
}
