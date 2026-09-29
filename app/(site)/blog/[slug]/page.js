import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { getBlogImage } from "@/lib/demo-images";
import { formatDate } from "../page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "PUBLISHED") return { title: "Artikel" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: post.featuredImage ? { images: [post.featuredImage] } : undefined
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <article className="article-page">
      <div className="container article-layout">
        <Link href="/blog" className="article-back">
          ← Kembali ke blog
        </Link>

        {post.featuredImage || getBlogImage(post.slug) ? (
          <div className="article-cover">
            <img
              src={post.featuredImage || getBlogImage(post.slug)}
              alt=""
              width={1100}
              height={520}
              decoding="async"
            />
          </div>
        ) : null}

        <header className="article-header">
          <div className="article-meta-line">
            <span className="meta">{formatDate(post.publishedAt || post.createdAt)}</span>
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
