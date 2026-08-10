"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useI18n } from "../../contexts/I18nContext";
import { logger } from "../../lib/logger";
import { toast } from "sonner";
import Loader from "@/components/Loader";

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  slug: string;
  readTime: number;
  thumbnailUrl: string;
  publishedAt: string;
}

export default function BlogPage() {
  const { t } = useI18n();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesTag =
      selectedTag === "All" ||
      post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/blogposts/?limit=${limit}&page=${page}`,
        );
        const blogs = Array.isArray(res.data.data) ? res.data.data : [];
        setBlogPosts(blogs);
        setTotalPages(res.data.totalPages || 1);
        logger.info("Blog page loaded", { page, postsCount: blogs.length });
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    const handlePrev = () => {
      if (page > 1) setPage((prev) => prev - 1);
    };
    fetchBlogs();
  }, [page]);

  // Open modal (single blog)
  const openModal = async (slug: string) => {
    try {
      const res = await axios.get(`/api/blogposts/${slug}/`);
      setActivePost(res.data);
      setModalOpen(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load blog details");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setActivePost(null);
  };

  // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />
      {/* Header */}
      <div className="border-b border-dim relative">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="tag mx-auto mb-5 mt-10 w-fit">Blog</div>
          <h1 className="text-4xl font-bold mb-4">{t("blog.title")}</h1>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        {/* Main Content */}
        <div className="lg:w-3/4 space-y-8">
          {loading ? (
            <Loader size="lg" text="Loading blogs..." />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : blogPosts.length === 0 ? (
            <p className="text-secondary">No blogs found</p>
          ) : (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full px-5 py-3 rounded-xl border border-dim bg-[var(--surface)] text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                    🔎
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "All",
                    "Technology",
                    "AI",
                    "Healthcare",
                    "Education",
                    "Innovation",
                    "Africa",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        selectedTag === tag
                          ? "bg-[var(--blue-bright)] text-white"
                          : "bg-[var(--blue-dim)] text-[var(--blue-bright)] hover:bg-[rgba(59,130,246,0.25)]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="card overflow-hidden flex flex-col"
                  >
                    <div className="h-56 w-full overflow-hidden rounded-t-xl">
                      <img
                        src={post.thumbnailUrl || "/images/blog/default.jpg"}
                        alt={post.title}
                        className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center space-x-3 text-xs text-secondary mb-2">
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                          <span>•</span>
                          <span>By {post.author}</span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-semibold mb-2 hover:text-[var(--blue-bright)] transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-secondary mb-4 text-sm sm:text-base line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between flex-wrap mt-2">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 mb-5 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-xs rounded-full border border-[rgba(59,130,246,0.25)] cursor-pointer transition-colors hover:bg-[rgba(59,130,246,0.25)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => openModal(post.slug)}
                          className="btn-primary text-xs"
                        >
                          {t("blog.readMore")}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`btn-ghost ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </button>
                <span className="text-secondary">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className={`btn-primary ${
                    page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 space-y-8">
          {/* Popular Posts */}
          <div className="card p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">
              {t("blog.popularPosts.title")}
            </h3>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <div
                  key={post.slug}
                  className="flex space-x-3 items-center hover:bg-[var(--surface-2)] p-2 rounded-lg cursor-pointer transition-colors"
                  onClick={() => openModal(post.slug)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.thumbnailUrl || "/images/blog/default.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm hover:text-[var(--blue-bright)] transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-secondary mt-1">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">{t("blog.tags.title")}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Digital Transformation",
                "AI",
                "Healthcare",
                "Education",
                "E-commerce",
                "Africa",
                "Innovation",
                "Technology",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-sm rounded-full border border-[rgba(59,130,246,0.25)] hover:bg-[rgba(59,130,246,0.25)] cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && activePost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card rounded-xl w-11/12 max-w-3xl max-h-[50vh] flex flex-col relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-secondary text-lg font-bold hover:text-[var(--blue-bright)] bg-[var(--surface)] rounded-full w-8 h-8 flex items-center justify-center border border-dim"
            >
              &times;
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                <img
                  src={activePost.thumbnailUrl || "/images/blog/default.jpg"}
                  alt={activePost.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                <h2 className="text-2xl font-bold mb-2">{activePost.title}</h2>

                <div className="flex items-center space-x-3 text-sm text-secondary mb-4">
                  <span>
                    {new Date(activePost.publishedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{activePost.readTime} min read</span>
                  <span>•</span>
                  <span>By {activePost.author}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {activePost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-xs rounded-full border border-[rgba(59,130,246,0.25)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-secondary leading-relaxed whitespace-pre-wrap">
                  {activePost.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
