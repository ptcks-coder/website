import Link from "next/link";
import { BLOG_POSTS } from "@/data/site";
import { getBlogImage } from "@/lib/demo-images";

export const metadata = {
  title: "Blog"
};

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

export default function BlogPage() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <div className="section-head">
            <div>
              <h1 className="page-intro-title">Blog</h1>
              <p>
                Artikel singkat seputar persiapan dokumen, BLK, dan alur izin pulang secara umum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card-media">
                  <img
                    src={getBlogImage(post.slug)}
                    alt=""
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="blog-card-body">
                  <span className="meta">{formatDate(post.date)}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="read-more">Baca selengkapnya →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
