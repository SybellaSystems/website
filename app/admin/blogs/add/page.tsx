"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // 👈 use sonner instead of react-hot-toast
import {
  FileText,
  Type,
  User,
  Tags,
  Image,
  Clock,
  Hash,
} from "lucide-react";

export default function AddBlogPage() {
  const router = useRouter();
  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    tags: "",
    slug: "",
    readTime: 5,
    thumbnailUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // show loading toast
    const toastId = toast.loading("Saving blog...");

    try {
      await axios.post(
        "/api/blogposts/",
        {
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()),
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      // update toast to success
      toast.success("🎉 Blog created successfully!", { id: toastId });

      // small delay so user sees toast before redirect
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 500);
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Failed to create blog.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          ➕ Add New Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Type size={16} /> Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <FileText size={16} /> Excerpt
            </label>
            <input
              type="text"
              name="excerpt"
              placeholder="Short summary of the blog"
              value={form.excerpt}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <FileText size={16} /> Content
            </label>
            <textarea
              name="content"
              placeholder="Write your full blog content here..."
              value={form.content}
              onChange={handleChange}
              rows={6}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <User size={16} /> Author
            </label>
            <input
              type="text"
              name="author"
              placeholder="Author name"
              value={form.author}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Tags size={16} /> Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="Comma separated (e.g. tech, react, ai)"
              value={form.tags}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Slug & Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Hash size={16} /> Slug
              </label>
              <input
                type="text"
                name="slug"
                placeholder="unique-blog-slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Clock size={16} /> Read Time (minutes)
              </label>
              <input
                type="number"
                name="readTime"
                value={form.readTime}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Image size={16} /> Thumbnail URL
            </label>
            <input
              type="text"
              name="thumbnailUrl"
              placeholder="https://example.com/image.jpg"
              value={form.thumbnailUrl}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
