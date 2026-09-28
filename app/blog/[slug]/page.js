import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPost } from "@/data/site";
import { getBlogImage } from "@/lib/demo-images";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artikel" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="article-page">
      <div className="container article-layout">
        <Link href="/blog" className="article-back">
          ← Kembali ke blog
        </Link>

        <div className="article-cover">
          <img
            src={getBlogImage(post.slug)}
            alt=""
            width={1100}
            height={520}
            decoding="async"
          />
        </div>

        <header className="article-header">
          <p className="meta">{formatDate(post.date)}</p>
          <h1>{post.title}</h1>
          <p className="article-lead">{post.excerpt}</p>
        </header>

        <div className="article-body">
          {post.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="article-footer-nav">
          <Link href="/blog" className="btn btn-secondary">
            ← Semua artikel
          </Link>
        </p>
      </div>
    </article>
  );
}
