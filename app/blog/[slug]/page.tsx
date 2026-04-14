"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";
import { mockBlogs } from "@/lib/mockBlogs";


interface BlogPostProps {
  params: { slug: string };
}

export default function BlogPost({ params }: BlogPostProps) {
  const blog = mockBlogs.find(b => b.slug === params.slug);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [showChat, setShowChat] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.12 }
    );
    contentRef.current?.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleExportChat = () => {
    if (chatMessages.length === 0) {
      alert("No chat messages to export");
      return;
    }
    console.log("Export disabled for now");
  };

  if (!blog) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 700, marginBottom: "clamp(16px, 2vw, 24px)" }}>Article not found</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "clamp(13px, 2vw, 14px)", marginBottom: "clamp(24px, 4vw, 32px)" }}>The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const relatedBlogs = mockBlogs.filter(b => b.category === blog.category && b.id !== blog.id).slice(0, 3);

  return (
    <div>
      {/* Hero with Featured Image */}
      <section style={{ position: "relative", height: "clamp(300px, 60vh, 600px)", overflow: "hidden", paddingTop: "clamp(60px, 10vw, 72px)" }}>
        {blog.featured_image && (
          <Image
            src={blog.featured_image}
            alt={blog.title}
            fill
            style={{ objectFit: "cover" }}
            priority
            quality={85}
          />
        )}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, var(--black) 0%, rgba(8,8,8,0.6) 50%, transparent 100%)",
          zIndex: 2
        }} />

        {/* Header content */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 3, padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 32px)" }}>
          <div style={{ maxWidth: 900 }}>
            <div style={{ display: "flex", gap: "clamp(12px, 2vw, 16px)", alignItems: "center", marginBottom: "clamp(16px, 2vw, 24px)", flexWrap: "wrap" }}>
              <div className="tag" style={{ marginBottom: 0 }}>{blog.category}</div>
              <span style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "var(--text-secondary)" }}>
                {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "clamp(16px, 2vw, 24px)" }}>
              {blog.title}
            </h1>
            <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 700 }}>
              {blog.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", background: "var(--charcoal)", borderTop: "1px solid var(--border)" }}>
        <div ref={contentRef} style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="fade-up" style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: "clamp(40px, 8vw, 60px)" }}>
            {/* Mock content */}
            {blog.content || (
              <>
                <p style={{ marginBottom: "clamp(20px, 3vw, 28px)" }}>
                  {blog.excerpt} This is the beginning of our comprehensive exploration into this topic. In today's rapidly evolving technological landscape, understanding these concepts is crucial for businesses looking to scale.
                </p>

                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "clamp(16px, 2vw, 24px)", marginTop: "clamp(32px, 6vw, 48px)", letterSpacing: "-0.02em" }}>
                  Key Insights
                </h2>
                <p style={{ marginBottom: "clamp(20px, 3vw, 28px)" }}>
                  Our team at Sybella Systems has identified several critical factors that determine success in this space. By leveraging our experience across Africa's tech ecosystem, we've developed a framework that guides our approach to every project.
                </p>

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "clamp(12px, 2vw, 16px)", marginTop: "clamp(24px, 4vw, 32px)" }}>
                  Best Practices
                </h3>
                <ul style={{ marginBottom: "clamp(20px, 3vw, 28px)", paddingLeft: "clamp(20px, 4vw, 32px)" }}>
                  {["Focus on user experience first", "Build for scalability from day one", "Invest in quality infrastructure", "Maintain clear documentation"].map((item, i) => (
                    <li key={i} style={{ marginBottom: "clamp(12px, 2vw, 16px)", color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--blue-bright)", marginRight: "clamp(8px, 1.5vw, 12px)" }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p style={{ marginBottom: "clamp(20px, 3vw, 28px)" }}>
                  The integration of these practices ensures that your projects not only meet current requirements but are also future-proof. As we continue to support businesses across the continent, we remain committed to sharing these insights with our community.
                </p>
              </>
            )}
          </div>

          {/* Author Info */}
          <div style={{ padding: "clamp(24px, 4vw, 32px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, marginTop: "clamp(40px, 8vw, 60px)", marginBottom: "clamp(40px, 8vw, 60px)" }} className="fade-up">
            <div style={{ display: "flex", gap: "clamp(16px, 3vw, 24px)", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "clamp(64px, 10vw, 80px)", height: "clamp(64px, 10vw, 80px)", borderRadius: 4, background: "linear-gradient(135deg, var(--blue), var(--emerald))", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700, marginBottom: "clamp(4px, 1vw, 8px)" }}>
                  {blog.author}
                </h4>
                <p style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "var(--text-secondary)", marginBottom: "clamp(12px, 2vw, 16px)", lineHeight: 1.6 }}>
                  Expert contributor at Sybella Systems with deep expertise in {blog.category.toLowerCase()}. Passionate about driving digital transformation across Africa.
                </p>
                <button onClick={() => setShowChat(!showChat)} className="btn-ghost" style={{ fontSize: "clamp(11px, 1.5vw, 12px)", padding: "clamp(8px, 1.5vw, 10px) clamp(14px, 3vw, 18px)" }}>
                  Ask a Question
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          {showChat && (
            <div style={{ padding: "clamp(24px, 4vw, 32px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, marginBottom: "clamp(40px, 8vw, 60px)" }} className="fade-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(16px, 2vw, 24px)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700 }}>Chat with Author</h4>
                <button onClick={handleExportChat} className="btn-ghost" style={{ fontSize: "clamp(10px, 1.5vw, 11px)", padding: "clamp(6px, 1vw, 8px) clamp(12px, 2vw, 16px)" }}>
                  📥 Export Chat as PDF
                </button>
              </div>
              <ChatWidget onMessageSent={(msg) => setChatMessages([...chatMessages, msg])} />
            </div>
          )}

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="fade-up">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, marginBottom: "clamp(24px, 4vw, 32px)", marginTop: "clamp(40px, 8vw, 60px)" }}>
                Related Articles
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 100%, 320px), 1fr))", gap: "clamp(20px, 3vw, 28px)" }}>
                {relatedBlogs.map(relatedBlog => (
                  <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`} style={{ textDecoration: "none" }}>
                    <div className="card" style={{ padding: "clamp(20px, 3vw, 24px)", height: "100%", cursor: "pointer" }}>
                      <div className="tag" style={{ marginBottom: "clamp(12px, 2vw, 16px)" }}>{relatedBlog.category}</div>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700, marginBottom: "clamp(8px, 1.5vw, 12px)", lineHeight: 1.3 }}>
                        {relatedBlog.title}
                      </h4>
                      <p style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "var(--text-secondary)", marginBottom: "clamp(12px, 2vw, 16px)" }}>
                        {relatedBlog.excerpt}
                      </p>
                      <p style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "var(--text-tertiary)" }}>
                        {new Date(relatedBlog.date).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }} className="fade-up">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "clamp(16px, 2vw, 24px)" }}>
              Ready to transform your business?
            </h2>
            <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "clamp(24px, 4vw, 32px)" }}>
              Join hundreds of African companies building with Sybella Systems.
            </p>
            <Link href="/impact#contact" className="btn-primary">Start Your Project</Link>
          </div>
        </div>
      </section>
    </div>
  );
}