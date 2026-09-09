"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  X,
  Search,
  Plus,
  FileText,
  User,
  Image as ImageIcon,
  ArrowUpRight,
  MoreHorizontal,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Loader from "@/components/Loader";

interface Blog {
  _id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  author: string;
  thumbnailUrl: string;
  content?: string;
}

export default function ViewBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogposts/", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setBlogs(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const getBlogImage = (blog: Blog) => {
    if (blog.thumbnailUrl) {
      return blog.thumbnailUrl;
    }

    if (blog.content) {
      const match = blog.content.match(
        /<img[^>]+src=["']([^"']+)["']/i,
      );

      if (match?.[1]) {
        return match[1];
      }
    }

    return "/images/blog/default.jpg";
  };

  const handleDeleteBlog = async (id: string) => {
    toast.warning("Are you sure you want to delete this article?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting article...");

          try {
            const res = await axios.delete(`/api/blogposts/${id}`, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            });

            if (res.status >= 200 && res.status < 300) {
              toast.success("Article deleted successfully!", {
                id: toastId,
              });

              fetchBlogs();
            } else {
              toast.error("Failed to delete article.", {
                id: toastId,
              });
            }
          } catch (err: any) {
            console.error(err);

            toast.error("Failed to delete article.", {
              id: toastId,
              description:
                err.response?.data?.message || "Please try again",
            });
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!editingBlog) return;

    setEditingBlog({
      ...editingBlog,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateBlog = async (id: string) => {
    if (!editingBlog) return;

    const toastId = toast.loading("Updating article...");

    try {
      const identifier = editingBlog.slug || id;

      const res = await axios.patch(
        `/api/blogposts/${identifier}`,
        {
          title: editingBlog.title,
          excerpt: editingBlog.excerpt,
          author: editingBlog.author,
          thumbnailUrl: editingBlog.thumbnailUrl,
          content: editingBlog.content,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (res.status >= 200 && res.status < 300) {
        toast.success("Article updated successfully!", {
          id: toastId,
        });

        closeModal();
        fetchBlogs();
      } else {
        toast.error("Failed to update article", {
          id: toastId,
        });
      }
    } catch (err: any) {
      console.error(err);

      toast.error("Failed to update article", {
        id: toastId,
        description:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Please try again",
      });
    }
  };

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query)
      );
    });
  }, [blogs, searchQuery]);

  const authorsCount = new Set(
    blogs.map((blog) => blog.author).filter(Boolean),
  ).size;

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* =========================================================
          TOP HEADER
      ========================================================= */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Dashboard</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600">Blog</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="hidden rounded-2xl bg-indigo-50 p-3.5 text-indigo-600 sm:flex">
                  <FileText size={25} strokeWidth={1.8} />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                      Blog Articles
                    </h1>

                    <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                      {blogs.length} published
                    </span>
                  </div>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Create, manage and maintain the content published
                    across the Sybella website.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = "/admin/blogs/create";
              }}
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 active:translate-y-0"
            >
              <Plus
                size={18}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              Create article
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-7 lg:px-10">
        {/* =======================================================
            STATS
        ======================================================= */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total articles
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {blogs.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All published content
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-transform group-hover:scale-105">
                <FileText size={21} strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Showing */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Search results
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {filteredBlogs.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {searchQuery
                    ? `Matching "${searchQuery}"`
                    : "Currently displayed"}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-transform group-hover:scale-105">
                <ArrowUpRight size={21} strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Authors */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Contributors
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {authorsCount}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Unique article authors
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600 transition-transform group-hover:scale-105">
                <User size={21} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            TOOLBAR
        ======================================================= */}
        <section className="mb-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search
                size={19}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by title, description or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  {filteredBlogs.length}{" "}
                  {filteredBlogs.length === 1 ? "article" : "articles"}
                </span>
              </div>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />

              <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                <Sparkles size={14} />
                Content management
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            CONTENT
        ======================================================= */}
        {loading ? (
          <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Loader size="lg" text="Loading articles..." />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              {searchQuery ? (
                <Search size={28} strokeWidth={1.7} />
              ) : (
                <FileText size={28} strokeWidth={1.7} />
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery ? "No articles found" : "Your blog is empty"}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {searchQuery
                ? "We couldn't find any articles matching your search. Try another title, author or keyword."
                : "Start publishing content by creating your first article."}
            </p>

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => {
                  window.location.href = "/admin/blogs/create";
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={18} />
                Create your first article
              </button>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="group flex min-h-[490px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
              >
                {/* =================================================
                    CARD IMAGE
                ================================================= */}
                <div className="relative h-56 shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src={getBlogImage(blog)}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Image gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-70" />

                  {/* Status */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-lg backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Published
                    </span>
                  </div>

                  {/* More */}
                  <button
                    className="absolute right-4 top-4 rounded-xl border border-white/20 bg-black/20 p-2 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:bg-black/40 group-hover:opacity-100"
                    aria-label="More options"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {/* Bottom image info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/85">
                      Article
                    </span>

                    {blog.slug && (
                      <span className="max-w-[170px] truncate text-xs text-white/70">
                        /{blog.slug}
                      </span>
                    )}
                  </div>
                </div>

                {/* =================================================
                    CARD BODY
                ================================================= */}
                <div className="flex flex-1 flex-col p-5">
                  <div>
                    <h2 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-indigo-600">
                      {blog.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* =================================================
                      CARD FOOTER
                  ================================================= */}
                  <div className="mt-auto pt-6">
                    <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <User size={16} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Author
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {blog.author || "Unknown author"}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
                        <FileText size={15} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <button
                        onClick={() => handleEditClick(blog)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98]"
                      >
                        <Edit size={15} />
                        Edit article
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog._id!)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3.5 text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-100 hover:text-red-600 active:scale-[0.98]"
                        aria-label={`Delete ${blog.title}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* =========================================================
          EDIT MODAL
      ========================================================= */}
      {isModalOpen && editingBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-5 sm:px-7">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Edit size={19} />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                    Content editor
                  </p>

                  <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-950">
                    Edit article
                  </h2>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close editor"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto">
              <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
                {/* Main form */}
                <div className="space-y-6 p-6 sm:p-7">
                  {/* Title */}
                  <div>
                    <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                      Article title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={editingBlog.title}
                      onChange={handleInputChange}
                      placeholder="Enter article title"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-950 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-800">
                        Excerpt
                      </label>

                      <span className="text-[11px] text-slate-400">
                        Short description
                      </span>
                    </div>

                    <textarea
                      name="excerpt"
                      value={editingBlog.excerpt}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Write a short description for the article..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm leading-6 text-slate-950 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-800">
                        Article content
                      </label>

                      <span className="text-[11px] text-slate-400">
                        HTML / rich content
                      </span>
                    </div>

                    <textarea
                      name="content"
                      value={editingBlog.content || ""}
                      onChange={handleInputChange}
                      rows={14}
                      placeholder="Write your article content..."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 font-mono text-xs leading-6 text-slate-950 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="border-t border-slate-200 bg-slate-50/70 p-6 lg:border-l lg:border-t-0 sm:p-7">
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-900">
                      Article details
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Manage the metadata and featured image.
                    </p>
                  </div>

                  {/* Author */}
                  <div className="mb-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Author
                    </label>

                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="author"
                        value={editingBlog.author}
                        onChange={handleInputChange}
                        placeholder="Author name"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="mb-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Slug
                    </label>

                    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-500">
                      /{editingBlog.slug || "article-slug"}
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Featured image
                    </label>

                    <div className="relative">
                      <ImageIcon
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="thumbnailUrl"
                        value={editingBlog.thumbnailUrl}
                        onChange={handleInputChange}
                        placeholder="Image URL..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={getBlogImage(editingBlog)}
                        alt="Featured image preview"
                        className="h-40 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/blog/default.jpg";
                        }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <span className="text-xs font-semibold text-emerald-700">
                        Published
                      </span>
                    </div>

                    <span className="text-[10px] font-medium text-emerald-600">
                      LIVE
                    </span>
                  </div>
                </aside>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:px-7">
              <p className="hidden text-xs text-slate-400 sm:block">
                Changes will be saved to the published article.
              </p>

              <div className="ml-auto flex items-center gap-2.5">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    handleUpdateBlog(editingBlog._id!)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98]"
                >
                  <Edit size={15} />
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}