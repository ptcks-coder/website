import { prisma } from "@/lib/prisma";

export async function getPublishedPosts(limit) {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      author: { select: { name: true } },
      categories: { select: { name: true, slug: true } }
    }
  });
}

export async function getPostBySlug(slug) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } }
    }
  });
}

export async function getActiveJobs() {
  return prisma.job.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getGalleryItems() {
  return prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
}

export async function getHeroSlides() {
  return prisma.heroSlide.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
}

export async function getBranches() {
  return prisma.branch.findMany({
    where: { active: true },
    orderBy: { nama: "asc" }
  });
}

export async function getEvents({ upcomingOnly = false, limit } = {}) {
  return prisma.event.findMany({
    where: {
      published: true,
      ...(upcomingOnly ? { startAt: { gte: new Date() } } : {})
    },
    orderBy: { startAt: "asc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      startAt: true,
      endAt: true,
      location: true,
      image: true,
      published: true
    }
  });
}

export async function getEventBySlug(slug) {
  return prisma.event.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      longDescriptionHtml: true,
      longDescriptionJson: true,
      startAt: true,
      endAt: true,
      location: true,
      image: true,
      published: true
    }
  });
}
