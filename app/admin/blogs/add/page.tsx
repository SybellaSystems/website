"use client";

import { useState, useRef } from "react";
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
  Upload,
} from "lucide-react";

export default function AddBlogPage() {
  const router = useRouter();
  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [form, setForm] = useState({
    title: "",
    expert: "",
    content: "",
    author: "",
    tags: "",
    readTime: 5,
    thumbnailUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(""); // Store uploaded image separately
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // If user enters URL manually, clear uploaded image
    if (name === "thumbnailUrl") {
      setForm({ ...form, [name]: value });
      setUploadedImageUrl(""); // Clear uploaded image when user types URL
      // Only show preview if it's a valid URL (not empty)
      if (value && value.trim()) {
        setImagePreview(value);
      } else {
        setImagePreview("");
      }
    } else if (name === "readTime") {
      // Handle number input separately
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const res = await axios.post("/api/blogposts/upload", uploadFormData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        // Store uploaded image URL separately, don't fill the URL input field
        setUploadedImageUrl(res.data.imageUrl);
        setImagePreview(res.data.imageUrl);
        // Clear the URL input field when uploading
        setForm((prev) => ({ ...prev, thumbnailUrl: "" }));
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear URL field when uploading from computer
      setForm((prev) => ({ ...prev, thumbnailUrl: "" }));
      setUploadedImageUrl(""); // Clear previous upload
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Upload the file
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // show loading toast
    const toastId = toast.loading("Saving blog...");

    try {
      // Prepare data for API - map expert to excerpt
      const { expert, ...formData } = form;
      const apiData = {
        ...formData,
        excerpt: expert, // Map expert to excerpt for API
        // Use uploaded image URL if available, otherwise use URL field
        thumbnailUrl: uploadedImageUrl || form.thumbnailUrl,
        tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0) : [],
        // Slug will be auto-generated from title in the API
      };
      
      await axios.post(
        "/api/blogposts/",
        apiData,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      // update toast to success
      toast.success("Blog created successfully!", { id: toastId });

      // small delay so user sees toast before redirect
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 500);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create blog.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full border p-3 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none dark:bg-slate-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder:text-gray-400";
  const labelClass =
    "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-dark-surface shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 flex items-center gap-2">
          ➕ Add New Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>
              <Type size={16} /> Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={form.title}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelClass}>
              <FileText size={16} /> Expert
            </label>
            <input
              type="text"
              name="expert"
              placeholder="Short summary of the blog"
              value={form.expert}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          {/* Content */}
          <div>
            <label className={labelClass}>
              <FileText size={16} /> Content
            </label>
            <textarea
              name="content"
              placeholder="Write your full blog content here..."
              value={form.content}
              onChange={handleChange}
              rows={6}
              className={`${fieldClass} resize-y min-h-[120px]`}
            />
          </div>

          {/* Author */}
          <div>
            <label className={labelClass}>
              <User size={16} /> Author
            </label>
            <input
              type="text"
              name="author"
              placeholder="Author name"
              value={form.author}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>
              <Tags size={16} /> Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="Comma separated (e.g. tech, react, ai)"
              value={form.tags}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          {/* Read Time */}
          <div>
            <label className={labelClass}>
              <Clock size={16} /> Read Time (minutes)
            </label>
            <input
              type="number"
              name="readTime"
              value={form.readTime}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className={labelClass}>
              <Image size={16} /> Thumbnail
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}

            {/* File Upload */}
            <div className="mb-3">
              <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-gray-800 dark:text-gray-200 ${
                form.thumbnailUrl && !uploadedImageUrl 
                  ? "border-gray-200 cursor-not-allowed opacity-50" 
                  : "border-gray-300 hover:border-indigo-400"
              }`}>
                <Upload size={20} className="text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {uploadingImage ? "Uploading..." : "Upload image from computer"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploadingImage || !!(form.thumbnailUrl && !uploadedImageUrl)}
                />
              </label>
              {form.thumbnailUrl && !uploadedImageUrl && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Clear URL field to upload from computer
                </p>
              )}
            </div>

            {/* URL Input */}
            <div className="relative">
              <span className="text-xs text-gray-500 mb-1 block">Or enter image URL:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="thumbnailUrl"
                  placeholder="https://example.com/image.jpg"
                  value={form.thumbnailUrl}
                  onChange={handleChange}
                  disabled={!!uploadedImageUrl}
                  className={`${fieldClass} disabled:bg-gray-100 disabled:text-gray-700 dark:disabled:bg-slate-900 dark:disabled:text-gray-400 disabled:cursor-not-allowed`}
                />
                {uploadedImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImageUrl("");
                      setImagePreview("");
                      setForm((prev) => ({ ...prev, thumbnailUrl: "" }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
                    title="Clear uploaded image"
                  >
                    Clear
                  </button>
                )}
              </div>
              {uploadedImageUrl && (
                <p className="text-xs text-gray-500 mt-1">
                  Image uploaded. Click "Clear" to enter URL instead.
                </p>
              )}
            </div>
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
