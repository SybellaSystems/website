"use client";

import { useEffect, useMemo, useState } from "react";
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

const TAG_FILTERS = [
  "All",
  "Technology",
  "AI",
  "Healthcare",
  "Education",
  "Innovation",
  "Africa",
];

const DEFAULT_THUMBNAIL = "/images/blog/default.jpg";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const { t } = useI18n();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const title = post.title ?? "";
      const excerpt = post.excerpt ?? "";
      const tags = post.tags ?? [];

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        excerpt.toLowerCase().includes(query);

      const matchesTag =
        selectedTag === "All" ||
        tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [blogPosts, search, selectedTag]);

  const isFiltering = search.trim().length > 0 || selectedTag !== "All";
  const hasFeatured = page === 1 && !isFiltering && filteredPosts.length > 0;
  const featuredPost = hasFeatured ? filteredPosts[0] : null;
  const gridPosts = hasFeatured ? filteredPosts.slice(1) : filteredPosts;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
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
    fetchBlogs();
  }, [page]);

  // Open modal (single blog)
  const openModal = async (slug: string) => {
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await axios.get(`/api/blogposts/${slug}/`);
      setActivePost(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load blog details");
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setActivePost(null);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTag("All");
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_60%)] pointer-events-none" />

      {/* Hero */}
      <div className="border-b border-dim relative">
        <div className="container mx-auto px-6 py-16 sm:py-20 text-center relative">
          <div className="tag mx-auto mb-6 w-fit">Insights &amp; Stories</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-[1.1]">
            {t("blog.title")}
          </h1>
          <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
            {t("blog.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        {/* Main Content */}
        <div className="lg:w-3/4 space-y-10 min-w-0">
          {loading ? (
            <Loader size="lg" text="Loading blogs..." />
          ) : error ? (
            <div className="card rounded-xl p-10 text-center">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="card rounded-xl p-10 text-center">
              <p className="text-secondary">No blogs found</p>
            </div>
          ) : (
            <>
              {/* Search & Filter Toolbar */}
              <div className="card rounded-xl p-4 sm:p-5 space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                    🔎
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-11 pr-10 py-3 rounded-xl border border-dim bg-[var(--surface)] text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)] transition"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-[var(--blue-bright)] transition"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {TAG_FILTERS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedTag === tag
                          ? "bg-[var(--blue-bright)] text-white"
                          : "bg-[var(--blue-dim)] text-[var(--blue-bright)] hover:bg-[rgba(59,130,246,0.25)]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  {isFiltering && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-full text-sm font-medium text-secondary border border-dim hover:text-[var(--blue-bright)] hover:border-[var(--blue-bright)] transition ml-auto"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                /* Empty search state */
                <div className="card rounded-xl p-14 text-center space-y-3">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-xl font-semibold">No articles found</h3>
                  <p className="text-secondary max-w-md mx-auto">
                    Try another search term or choose a different category.
                  </p>
                  <button onClick={clearFilters} className="btn-primary mt-2">
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Featured Article */}
                  {featuredPost && (
                    <article className="card overflow-hidden rounded-2xl grid grid-cols-1 md:grid-cols-2">
                      <div className="h-64 md:h-full w-full overflow-hidden">
                        <img
                          src={featuredPost.thumbnailUrl || DEFAULT_THUMBNAIL}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 sm:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="tag w-fit">Featured</span>
                          {featuredPost.tags?.[0] && (
                            <span className="px-3 py-1 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-xs rounded-full border border-[rgba(59,130,246,0.25)]">
                              {featuredPost.tags[0]}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight hover:text-[var(--blue-bright)] transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-secondary mb-5 leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-secondary mb-6">
                          <span>By {featuredPost.author}</span>
                          <span>•</span>
                          <span>{formatDate(featuredPost.publishedAt)}</span>
                          <span>•</span>
                          <span>{featuredPost.readTime} min read</span>
                        </div>
                        <button
                          onClick={() => openModal(featuredPost.slug)}
                          className="btn-primary w-fit"
                        >
                          Read article
                        </button>
                      </div>
                    </article>
                  )}

                  {/* Blog Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridPosts.map((post) => (
                      <article
                        key={post.slug}
                        className="card overflow-hidden rounded-xl flex flex-col group transition-transform duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={post.thumbnailUrl || DEFAULT_THUMBNAIL}
                            alt={post.title}
                            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          {post.tags?.[0] && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--surface)]/90 backdrop-blur text-[var(--blue-bright)] text-xs font-medium rounded-full border border-[rgba(59,130,246,0.25)]">
                              {post.tags[0]}
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-secondary mb-2">
                              <span>{formatDate(post.publishedAt)}</span>
                              <span>•</span>
                              <span>{post.readTime} min read</span>
                            </div>

                            <h2 className="text-lg font-semibold mb-2 leading-snug hover:text-[var(--blue-bright)] transition-colors line-clamp-2">
                              {post.title}
                            </h2>

                            <p className="text-secondary mb-4 text-sm line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {(post.tags ?? []).slice(0, 3).map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => setSelectedTag(tag)}
                                  className="px-2 py-1 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-xs rounded-full border border-[rgba(59,130,246,0.25)] cursor-pointer transition-colors hover:bg-[rgba(59,130,246,0.25)]"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs text-secondary">
                                By {post.author}
                              </span>
                              <button
                                onClick={() => openModal(post.slug)}
                                className="btn-primary text-xs"
                              >
                                {t("blog.readMore")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 pt-4">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`btn-ghost ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </button>
                <span className="text-secondary text-sm px-3 py-1 rounded-full border border-dim">
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
            <div className="space-y-2">
              {blogPosts.length === 0 && (
                <p className="text-sm text-secondary">No posts yet</p>
              )}
              {blogPosts.slice(0, 3).map((post) => (
                <div
                  key={post.slug}
                  role="button"
                  tabIndex={0}
                  className="flex space-x-3 items-center hover:bg-[var(--surface-2)] p-2 rounded-lg cursor-pointer transition-colors"
                  onClick={() => openModal(post.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") openModal(post.slug);
                  }}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.thumbnailUrl || DEFAULT_THUMBNAIL}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm hover:text-[var(--blue-bright)] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-secondary mt-1">
                      {formatDate(post.publishedAt)} • {post.readTime} min
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
              {TAG_FILTERS.filter((tag) => tag !== "All").map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTag === tag
                      ? "bg-[var(--blue-bright)] text-white border-[var(--blue-bright)]"
                      : "bg-[var(--blue-dim)] text-[var(--blue-bright)] border-[rgba(59,130,246,0.25)] hover:bg-[rgba(59,130,246,0.25)]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="card p-6 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_65%)] pointer-events-none" />
            <div className="relative">
              <h3 className="text-lg font-bold mb-2">Stay in the loop</h3>
              <p className="text-sm text-secondary mb-4">
                Get the latest insights from Sybella Systems, straight to your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-dim bg-[var(--surface)] text-primary text-sm placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)]"
                />
                <button className="btn-primary w-full text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="card rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 text-secondary text-lg font-bold hover:text-[var(--blue-bright)] bg-[var(--surface)] rounded-full w-9 h-9 flex items-center justify-center border border-dim transition-colors"
            >
              &times;
            </button>

            {modalLoading || !activePost ? (
              <div className="p-16">
                <Loader size="lg" text="Loading article..." />
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                <img
                  src={activePost.thumbnailUrl || DEFAULT_THUMBNAIL}
                  alt={activePost.title}
                  className="w-full h-56 sm:h-72 lg:h-80 object-cover"
                />
                <div className="p-6 sm:p-8 lg:p-10 max-w-2xl mx-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(activePost.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-xs rounded-full border border-[rgba(59,130,246,0.25)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                    {activePost.title}
                  </h2>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-secondary mb-8 pb-6 border-b border-dim">
                    <span>By {activePost.author}</span>
                    <span>•</span>
                    <span>{formatDate(activePost.publishedAt)}</span>
                    <span>•</span>
                    <span>{activePost.readTime} min read</span>
                  </div>
                  <div className="text-secondary text-base sm:text-lg leading-8 whitespace-pre-wrap">
                    {activePost.content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}