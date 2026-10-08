import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { getBlogImage } from "@/lib/demo-images";
import { pageMetadata, articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { formatDate } from "../page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "PUBLISHED") return { title: "Artikel" };

  const image = post.featuredImage || getBlogImage(post.slug);
  const tagNames = (post.tags || []).map((t) => t.name);

  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    path: `/blog/${post.slug}`,
    image,
    type: "article",
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
    authors: post.author?.name ? [post.author.name] : undefined,
    keywords: post.focusKeyword ? [post.focusKeyword, ...tagNames] : tagNames
  });
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  const cover = post.featuredImage || getBlogImage(post.slug);
  const published = post.publishedAt || post.createdAt;

  return (
    <article className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd({ post, image: cover }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Beranda", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])
        )}
      />
      <div className="container article-layout">
        <Link href="/blog" className="article-back">
          ← Kembali ke blog
        </Link>

        {cover ? (
          <div className="article-cover">
            <img
              src={cover}
              alt=""
              width={1100}
              height={520}
              decoding="async"
            />
          </div>
        ) : null}

        <header className="article-header">
          <div className="article-meta-line">
            <span className="meta">{formatDate(published)}</span>
            {post.author?.name ? <span>oleh {post.author.name}</span> : null}
            {post.categories.map((c) => (
              <span key={c.slug} className="article-tags" style={{ marginTop: 0 }}>
                <span>{c.name}</span>
              </span>
            ))}
          </div>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="article-lead">{post.excerpt}</p> : null}
        </header>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
        />

        {post.tags.length ? (
          <div className="article-tags">
            {post.tags.map((t) => (
              <span key={t.slug}>{t.name}</span>
            ))}
          </div>
        ) : null}

        <p className="article-footer-nav">
          <Link href="/blog" className="btn btn-secondary">
            ← Semua artikel
          </Link>
        </p>
      </div>
    </article>
  );
}
