"use client";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  featured_image?: string;
  readTime?: number;
}

export default function BlogCard({ slug, title, excerpt, date, category, author, featured_image, readTime = 5 }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer", overflow: "hidden", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {/* Featured Image */}
        {featured_image && (
          <div style={{ position: "relative", width: "100%", height: "clamp(200px, 40vw, 280px)", overflow: "hidden", background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(45,186,133,0.1))" }}>
            <Image
              src={featured_image}
              alt={title}
              fill
              style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
              onMouseEnter={(e) => { const img = e.currentTarget; img.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { const img = e.currentTarget; img.style.transform = "scale(1)"; }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "clamp(20px, 3vw, 28px)", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Meta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "clamp(8px, 2vw, 12px)", marginBottom: "clamp(12px, 2vw, 16px)", flexWrap: "wrap" }}>
            <div className="tag">{category}</div>
            <span style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--text-tertiary)" }}>
              {readTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2.5vw, 20px)", fontWeight: 700, marginBottom: "clamp(8px, 1.5vw, 12px)", lineHeight: 1.3, color: "var(--text-primary)" }}>
            {title}
          </h3>

          {/* Excerpt */}
          <p style={{ fontSize: "clamp(13px, 1.8vw, 14px)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "clamp(16px, 2vw, 24px)", flex: 1 }}>
            {excerpt}
          </p>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "clamp(12px, 2vw, 16px)", borderTop: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "var(--text-secondary)", marginBottom: 2 }}>By {author}</p>
              <p style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--text-tertiary)" }}>
                {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div style={{ color: "var(--blue-bright)", fontSize: "clamp(14px, 2vw, 16px)" }}>→</div>
          </div>
        </div>
      </div>
    </Link>
  );
}