"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface ImageInsertModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (image: {
    src: string;
    alt: string;
    align: "left" | "center" | "right";
    wrap: boolean;
    width: string;
  }) => void;
  adminToken: string | null;
}

export default function ImageInsertModal({
  open,
  onClose,
  onInsert,
  adminToken,
}: ImageInsertModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [align, setAlign] =
    useState<"left" | "center" | "right">("center");

  const [wrap, setWrap] = useState(false);
  const [width, setWidth] = useState("100%");

  useEffect(() => {
    if (!open) {
      setMode("upload");
      setImageUrl("");
      setAlt("");
      setPreview("");
      setAlign("center");
      setWrap(false);
      setWidth("100%");
      setUploading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload JPEG, PNG, WebP, or GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    // Immediate local preview
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "/api/blogposts/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Upload failed"
        );
      }

      setImageUrl(response.data.imageUrl);

      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Image upload error:", error);

      setPreview("");
      setImageUrl("");

      toast.error(
        error.response?.data?.message ||
          "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = e.target.value;

    setImageUrl(url);
    setPreview(url);
  };

  const handleInsert = () => {
    if (!imageUrl) {
      toast.error("Please select an image first.");
      return;
    }

    onInsert({
      src: imageUrl,
      alt: alt || "Blog image",
      align,
      wrap,
      width,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insert Image
            </h2>

            <p className="text-sm text-gray-500">
              Add and customize an image inside your blog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          {/* Source selector */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Image source
            </div>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                  mode === "upload"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                }`}
              >
                <Upload size={17} />
                Upload from computer
              </button>

              <button
                type="button"
                onClick={() => setMode("url")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                  mode === "url"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                }`}
              >
                <LinkIcon size={17} />
                Image URL
              </button>

            </div>
          </div>

          {/* Upload */}
          {mode === "upload" && (
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-8 transition hover:border-indigo-400 hover:bg-indigo-50/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:hover:border-indigo-500"
              >
                <Upload
                  size={28}
                  className="mb-2 text-gray-400"
                />

                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {uploading
                    ? "Uploading image..."
                    : "Click to upload an image"}
                </span>

                <span className="mt-1 text-xs text-gray-500">
                  JPEG, PNG, WebP or GIF · Max 5MB
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* URL */}
          {mode === "url" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <ImageIcon size={16} />
                Preview
              </div>

              <div className="flex max-h-56 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-52 max-w-full rounded-lg object-contain"
                />
              </div>
            </div>
          )}

          {/* Alt text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alt text
            </label>

            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for accessibility..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Alignment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alignment
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(["left", "center", "right"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAlign(option)}
                    className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                      align === option
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Text wrapping */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text wrapping
                </div>

                <div className="text-xs text-gray-500">
                  Allow paragraphs to flow around the image.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWrap(!wrap)}
                className={`relative h-6 w-11 rounded-full transition ${
                  wrap
                    ? "bg-indigo-600"
                    : "bg-gray-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    wrap ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Width */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image width
            </label>

            <div className="grid grid-cols-4 gap-2">
              {["25%", "50%", "75%", "100%"].map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setWidth(option)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      width === option
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleInsert}
            disabled={!imageUrl || uploading}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Insert Image
          </button>
        </div>

      </div>
    </div>
  );
}