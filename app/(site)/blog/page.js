import Link from "next/link";
import { getPublishedPosts } from "@/lib/queries";
import { getBlogImage } from "@/lib/demo-images";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Artikel dan panduan seputar penempatan CPMI: dokumen, BLK, dan tahapan proses di CKS.",
  path: "/blog"
});

export function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(iso));
  } catch {
    return String(iso);
  }
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <div className="section-head">
            <div>
              <h1 className="page-intro-title">Blog</h1>
              <p>Artikel dan informasi seputar proses penempatan CPMI di CKS.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {posts.length === 0 ? (
            <p className="kontak-note">Belum ada artikel yang diterbitkan.</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card-media">
                    <img
                      src={post.featuredImage || getBlogImage(post.slug)}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="blog-card-body">
                    <span className="meta">
                      {formatDate(post.publishedAt || post.createdAt)}
                      {post.categories.length ? ` — ${post.categories.map((c) => c.name).join(", ")}` : ""}
                    </span>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <span className="read-more">Baca selengkapnya →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
