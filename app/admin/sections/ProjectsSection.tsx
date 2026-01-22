"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/Loader";

interface Project {
  id: string;
  title: string;
  overview: string;
  image?: string;
  problemSolved?: string;
  techStack: string[];
  demoLink?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Error loading projects:", err);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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

      const res = await axios.post("/api/projects/upload", uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setEditingProject((prev) => ({ ...prev, image: res.data.imageUrl }));
        setImagePreview(res.data.imageUrl);
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

  const handleSave = async () => {
    if (!editingProject) return;

    if (!editingProject.title || !editingProject.overview) {
      toast.error("Please fill in title and overview");
      return;
    }

    try {
      // Ensure techStack is always an array of strings
      let techStackArray: string[] = [];
      if (editingProject.techStack) {
        if (Array.isArray(editingProject.techStack)) {
          techStackArray = editingProject.techStack
            .map((s) => String(s).trim())
            .filter((s) => s.length > 0);
        } else {
          // Handle edge case where techStack might be a string
          techStackArray = String(editingProject.techStack)
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
      }

      const projectToSave = {
        ...editingProject,
        techStack: techStackArray,
      };

      if (editingProject.id) {
        const toastId = toast.loading("Updating project...");
        const res = await axios.patch(
          `/api/projects/${editingProject.id}`,
          projectToSave,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.status >= 200 && res.status < 300) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? res.data : p))
          );
          toast.success("✅ Project updated successfully!", { id: toastId });
        } else {
          toast.error("❌ Failed to update project", { id: toastId });
        }
      } else {
        const toastId = toast.loading("Creating project...");
        const res = await axios.post("/api/projects", projectToSave);
        if (res.status >= 200 && res.status < 300) {
          setProjects((prev) => [res.data, ...prev]);
          toast.success("✅ Project created successfully!", { id: toastId });
        } else {
          toast.error("❌ Failed to create project", { id: toastId });
        }
      }

      setShowForm(false);
      setEditingProject(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "❌ Error saving project", { 
        description: err.response?.data?.message || 'Please try again'
      });
    }
  };

  const handleDelete = async (id: string) => {
    toast.warning("⚠️ Are you sure you want to delete this project?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting project...");
          try {
            const res = await axios.delete(`/api/projects/${id}`);
            // Show success if request succeeds
            if (res.status >= 200 && res.status < 300) {
              setProjects((prev) => prev.filter((p) => p.id !== id));
              toast.success("✅ Project deleted successfully!", { id: toastId });
            } else {
              toast.error("❌ Failed to delete project", { id: toastId });
            }
          } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.error || "❌ Delete failed", { 
              id: toastId,
              description: err.response?.data?.message || 'Please try again'
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

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setImagePreview(project.image || "");
    setShowForm(true);
  };

  const openCreateModal = () => {
    setEditingProject({
      title: "",
      overview: "",
      image: "",
      problemSolved: "",
      techStack: [],
      demoLink: "",
      isActive: true,
    });
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" text="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Projects</h2>
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
          onClick={openCreateModal}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-lg">No projects available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {p.image && (
                <div className="relative overflow-hidden h-48">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/innovation.jpg";
                    }}
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {p.title}
                  </h3>
                  {p.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2">
                  {p.overview}
                </p>
                {p.techStack && p.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.techStack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {p.techStack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                        +{p.techStack.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && editingProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 p-4 flex justify-center items-center"
          onClick={resetForm}
        >
          <div
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editingProject.id ? "Edit Project" : "New Project"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                      id="project-image-upload"
                    />
                    <label
                      htmlFor="project-image-upload"
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      JPEG, PNG, WebP, or GIF (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter project title"
                  value={editingProject.title || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                />
              </div>

              {/* Overview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overview <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Brief description of the project"
                  value={editingProject.overview || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, overview: e.target.value })
                  }
                />
              </div>

              {/* Problem Solved - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Solved (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="What problem does this project solve?"
                  value={editingProject.problemSolved || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, problemSolved: e.target.value })
                  }
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="React, Node.js, MongoDB (comma separated)"
                  value={
                    Array.isArray(editingProject.techStack)
                      ? editingProject.techStack.join(", ")
                      : editingProject.techStack || ""
                  }
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      techStack: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate technologies with commas
                </p>
              </div>

              {/* Demo Link - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Demo Link (Optional)
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="https://demo.example.com"
                  value={editingProject.demoLink || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, demoLink: e.target.value })
                  }
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingProject.isActive !== false}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Make project active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
              >
                {editingProject.id ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
