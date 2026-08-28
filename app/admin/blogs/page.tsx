"use client";

import { useEffect, useState } from "react";
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
  CalendarDays,
  ArrowUpRight,
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

  const handleDeleteBlog = async (id: string) => {
    toast.warning("Are you sure you want to delete this blog?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting blog...");

          try {
            const res = await axios.delete(`/api/blogposts/${id}`, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            });

            if (res.status >= 200 && res.status < 300) {
              toast.success("Blog deleted successfully!", {
                id: toastId,
              });

              fetchBlogs();
            } else {
              toast.error("Failed to delete blog.", {
                id: toastId,
              });
            }
          } catch (err: any) {
            console.error(err);

            toast.error("Failed to delete blog.", {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingBlog) return;

    setEditingBlog({
      ...editingBlog,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateBlog = async (id: string) => {
    if (!editingBlog) return;

    const toastId = toast.loading("Updating blog...");

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
        }
      );

      if (res.status >= 200 && res.status < 300) {
        toast.success("Blog updated successfully!", {
          id: toastId,
        });

        closeModal();
        fetchBlogs();
      } else {
        toast.error("Failed to update blog", {
          id: toastId,
        });
      }
    } catch (err: any) {
      console.error(err);

      toast.error("Failed to update blog", {
        id: toastId,
        description:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Please try again",
      });
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();

    return (
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <FileText size={16} />
                <span>Content Management</span>
                <span>•</span>
                <span>Articles</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Blog Articles
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage, edit and publish your website articles.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/admin/blogs/create";
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Plus size={18} />
              Create Article
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Articles
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {blogs.length}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileText size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Showing
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {filteredBlogs.length}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ArrowUpRight size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Authors
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {new Set(blogs.map((blog) => blog.author)).size}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <User size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <p className="text-sm text-slate-500">
            {filteredBlogs.length} article
            {filteredBlogs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ================= BLOGS ================= */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader size="lg" text="Loading articles..." />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
              <FileText size={32} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              {searchQuery ? "No articles found" : "No articles yet"}
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {searchQuery
                ? "Try searching with another title, author or keyword."
                : "Create your first article to start building your blog."}
            </p>

            {!searchQuery && (
              <button
                onClick={() => {
                  window.location.href = "/admin/blogs/create";
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={18} />
                Create Article
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={
                      blog.thumbnailUrl ||
                      "/images/blog/default.jpg"
                    }
                    alt={blog.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
                    Published
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4">
                    <h2 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-indigo-600">
                      {blog.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <User size={15} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Author
                          </p>

                          <p className="text-sm font-medium text-slate-700">
                            {blog.author}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        Article
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditClick(blog)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog._id!)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ================= EDIT MODAL ================= */}
      {isModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Article Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Edit Article
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-6">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Article title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editingBlog.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Excerpt
                </label>

                <textarea
                  name="excerpt"
                  value={editingBlog.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Write a short description..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Author */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  value={editingBlog.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Featured image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="thumbnailUrl"
                    value={editingBlog.thumbnailUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {editingBlog.thumbnailUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={editingBlog.thumbnailUrl}
                      alt="Preview"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Article content
                </label>

                <textarea
                  name="content"
                  value={editingBlog.content || ""}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Write your article content..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() => handleUpdateBlog(editingBlog._id!)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}