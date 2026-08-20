"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  Image as ImageIcon,
  User,
  Clock,
  Tag,
  Search,
  Check,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import BlogEditor from "@/components/blog/BlogEditor";

export default function AddBlogPage() {
  const router = useRouter();

  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    tags: [] as string[],
    readTime: 5,
    thumbnailUrl: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(true);

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
  };

  /* ---------------------------------------------------------
     TAGS
  --------------------------------------------------------- */

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (form.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    updateForm("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateForm(
      "tags",
      form.tags.filter((item) => item !== tag),
    );
  };

  /* ---------------------------------------------------------
     IMAGE UPLOAD
  --------------------------------------------------------- */

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload JPG, PNG, WebP or GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    setUploadingImage(true);

    try {
      const data = new FormData();

      data.append("image", file);

      const response = await axios.post(
        "/api/blogposts/upload",
        data,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.data.success) {
        const url = response.data.imageUrl;

        setUploadedImageUrl(url);
        setImagePreview(url);

        updateForm("thumbnailUrl", url);

        toast.success("Featured image uploaded");
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to upload image",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      handleImageUpload(file);
    }
  };

  /* ---------------------------------------------------------
     SAVE
  --------------------------------------------------------- */

  const handleSubmit = async (
    e?: React.FormEvent,
  ) => {
    e?.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Please write some content");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Publishing article...");

    try {
      await axios.post(
        "/api/blogposts/",
        {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          tags: form.tags,
          readTime: form.readTime,
          thumbnailUrl:
            uploadedImageUrl || form.thumbnailUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      setSaved(true);

      toast.success(
        "Article published successfully!",
        {
          id: toastId,
        },
      );

      setTimeout(() => {
        router.push("/admin/blogs");
      }, 700);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to publish article.",
        {
          id: toastId,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="text-xs font-medium text-gray-400">
                ARTICLES
              </p>

              <h1 className="text-sm font-semibold">
                Create new article
              </h1>
            </div>

          </div>

          <div className="flex items-center gap-3">

            {/* Save status */}

            <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">

              {saved ? (
                <>
                  <Check
                    size={15}
                    className="text-green-500"
                  />

                  Saved
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-orange-400" />

                  Unsaved changes
                </>
              )}

            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Eye size={16} />

              Preview
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Send size={16} />
              )}

              {loading ? "Publishing..." : "Publish"}
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-6 py-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* =================================================
              MAIN EDITOR
          ================================================= */}

          <section className="min-w-0">

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="p-8">

                {/* Title */}

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateForm(
                      "title",
                      e.target.value,
                    )
                  }
                  placeholder="Article title..."
                  className="w-full border-0 bg-transparent text-4xl font-bold tracking-tight text-gray-950 outline-none placeholder:text-gray-300 md:text-5xl"
                />

                {/* Excerpt */}

                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    updateForm(
                      "excerpt",
                      e.target.value,
                    )
                  }
                  placeholder="Write a short description of your article..."
                  rows={2}
                  className="mt-5 w-full resize-none border-0 bg-transparent text-lg leading-relaxed text-gray-500 outline-none placeholder:text-gray-300"
                />

                <div className="my-8 border-t border-gray-100" />

                {/* Editor */}

                <BlogEditor
                  value={form.content}
                  onChange={(content) =>
                    updateForm(
                      "content",
                      content,
                    )
                  }
                />

              </div>

            </div>

          </section>


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Publishing */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <h2 className="font-semibold">
                  Publishing
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  Draft
                </span>

              </div>

              <div className="space-y-4">

                {/* Author */}

                <div>

                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <User size={14} />
                    Author
                  </label>

                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) =>
                      updateForm(
                        "author",
                        e.target.value,
                      )
                    }
                    placeholder="Author name"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* Read time */}

                <div>

                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <Clock size={14} />
                    Reading time
                  </label>

                  <div className="flex items-center gap-2">

                    <input
                      type="number"
                      min={1}
                      value={form.readTime}
                      onChange={(e) =>
                        updateForm(
                          "readTime",
                          Number(
                            e.target.value,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <span className="text-sm text-gray-400">
                      min
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                FEATURED IMAGE
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="font-semibold">
                  Featured image
                </h2>

                <ImageIcon
                  size={17}
                  className="text-gray-400"
                />

              </div>

              {imagePreview ? (

                <div className="group relative overflow-hidden rounded-xl">

                  <img
                    src={imagePreview}
                    alt="Featured"
                    className="h-48 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setUploadedImageUrl("");
                      updateForm(
                        "thumbnailUrl",
                        "",
                      );

                      if (
                        fileInputRef.current
                      ) {
                        fileInputRef.current.value =
                          "";
                      }
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={15} />
                  </button>

                </div>

              ) : (

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-5 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
                >

                  {uploadingImage ? (
                    <Loader2
                      className="mb-3 animate-spin text-indigo-600"
                    />
                  ) : (
                    <Upload
                      className="mb-3 text-gray-400"
                      size={24}
                    />
                  )}

                  <p className="text-sm font-medium">
                    {uploadingImage
                      ? "Uploading..."
                      : "Upload featured image"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG, WebP up to 5MB
                  </p>

                </button>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

            </div>


            {/* =================================================
                TAGS
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">

                <Tag
                  size={17}
                  className="text-gray-400"
                />

                <h2 className="font-semibold">
                  Tags
                </h2>

              </div>

              <div className="flex flex-wrap gap-2">

                {form.tags.map((tag) => (

                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() =>
                        removeTag(tag)
                      }
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>

                  </span>

                ))}

              </div>

              <div className="mt-3 flex gap-2">

                <input
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-lg bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Add
                </button>

              </div>

            </div>


            {/* =================================================
                SEO
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">

                <Search
                  size={17}
                  className="text-gray-400"
                />

                <h2 className="font-semibold">
                  SEO
                </h2>

              </div>

              <p className="text-xs leading-relaxed text-gray-400">
                SEO fields can be added here later
                for search engine optimization.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}