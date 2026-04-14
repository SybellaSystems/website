"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import ChatWidget from "@/components/ChatWidget";
import { mockBlogs } from "@/lib/mockBlogs";

export default function BlogPage() {
  const [filteredBlogs, setFilteredBlogs] = useState(mockBlogs);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const blogRef = useRef<HTMLDivElement>(null);

  // Filter blogs by category and search
  useEffect(() => {
    let filtered = mockBlogs;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  }, [selectedCategory, searchTerm]);

  // Intersection observer for fade-in animation
  useEffect(() => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.12 }
    );
    blogRef.current?.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filteredBlogs]);

  const categories = ["All", ...new Set(mockBlogs.map(blog => blog.category))];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "clamp(60px, 10vw, 72px)" }}>
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "clamp(400px, 80vw, 800px)", height: "clamp(400px, 80vw, 800px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 32px)", width: "100%", position: "relative", zIndex: 2 }}>
          <div className="fade-up" style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
            <div className="tag" style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
              Insights & Thought Leadership
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: "clamp(20px, 4vw, 28px)" }}>
            Sybella<br />
            <span className="gradient-text">Insights</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 580, marginBottom: "clamp(32px, 6vw, 44px)" }}>
            Deep dives into African tech trends, software engineering best practices, and the future of digital infrastructure. Learn from our experts as we shape the continent's digital future.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section style={{ padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", background: "var(--charcoal)", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Search Bar */}
          <div className="fade-up" style={{ marginBottom: "clamp(40px, 8vw, 60px)" }}>
            <div style={{ position: "relative", maxWidth: 600 }}>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(13px, 2vw, 14px)",
                  transition: "all 0.3s",
                  outline: "none"
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <svg style={{ position: "absolute", right: "clamp(12px, 2vw, 16px)", top: "50%", transform: "translateY(-50%)", width: 20, height: 20, opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="fade-up" style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap", marginBottom: "clamp(40px, 8vw, 60px)" }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "clamp(10px, 1.5vw, 12px) clamp(16px, 3vw, 20px)",
                  background: selectedCategory === category ? "var(--blue)" : "transparent",
                  color: selectedCategory === category ? "var(--black)" : "var(--text-secondary)",
                  border: selectedCategory === category ? "1px solid var(--blue)" : "1px solid var(--border-bright)",
                  borderRadius: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  minHeight: 44
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    (e.target as HTMLButtonElement).style.borderColor = "var(--blue)";
                    (e.target as HTMLButtonElement).style.color = "var(--blue-bright)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    (e.target as HTMLButtonElement).style.borderColor = "var(--border-bright)";
                    (e.target as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p style={{ fontSize: "clamp(12px, 2vw, 14px)", color: "var(--text-secondary)", marginBottom: "clamp(30px, 6vw, 40px)" }}>
            Showing {filteredBlogs.length} of {mockBlogs.length} articles
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section ref={blogRef} style={{ padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {filteredBlogs.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px, 100%, 380px), 1fr))", gap: "clamp(24px, 4vw, 32px)" }}>
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="fade-up">
                  <BlogCard {...blog} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "clamp(60px, 10vw, 100px) clamp(24px, 5vw, 32px)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, marginBottom: "clamp(12px, 2vw, 16px)" }}>No articles found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "clamp(13px, 2vw, 14px)", marginBottom: "clamp(24px, 4vw, 32px)" }}>
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="btn-ghost"
                style={{ display: "inline-flex" }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />

      <style>{`
        @media (max-width: 768px) {
          .search-filters { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}