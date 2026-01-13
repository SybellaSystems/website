"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Project {
  id: string;
  title: string;
  overview: string;
  image?: string;
  problemSolved?: string;
  techStack: string[];
  partners?: string[];
  callToAction?: string;
  isActive?: boolean;
  demoLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSave = async () => {
    if (!editingProject) return;

    try {
      const projectToSave = {
        ...editingProject,
        techStack: editingProject.techStack?.map((s) => s.trim()).filter(Boolean),
      };

      if (editingProject.id) {
        const res = await axios.patch(`/api/projects/${editingProject.id}`, projectToSave, {
          headers: { "Content-Type": "application/json" },
        });
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? res.data : p))
        );
      } else {
        const res = await axios.post("/api/projects", projectToSave);
        setProjects((prev) => [res.data, ...prev]);
      }

      setShowForm(false);
      setEditingProject(null);
    } catch (err: any) {
      alert("Error saving project: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  if (loading) return <p className="text-gray-500">Loading projects...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">🚀 Projects</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => {
            setEditingProject({
              title: "",
              overview: "",
              image: "",
              problemSolved: "",
              techStack: [],
              partners: [],
              callToAction: "",
              isActive: true,
              demoLink: "",
            });
            setShowForm(true);
          }}
        >
          + New Project
        </button>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{p.overview}</p>
                <p className="mt-2 text-sm">
                  {p.isActive ? (
                    <span className="text-green-600 font-medium">✅ Active</span>
                  ) : (
                    <span className="text-red-500 font-medium">❌ Inactive</span>
                  )}
                </p>
                {p.techStack && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingProject(p);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-auto animate-fadeIn">
            <h3 className="text-2xl font-semibold mb-4">
              {editingProject.id ? "Edit Project" : "New Project"}
            </h3>

            <div className="flex flex-col gap-3">
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
                value={editingProject.title || ""}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              />
              <textarea
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Overview"
                value={editingProject.overview || ""}
                onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Image URL"
                value={editingProject.image || ""}
                onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
              />
              <textarea
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Problem Solved"
                value={editingProject.problemSolved || ""}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, problemSolved: e.target.value })
                }
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Tech Stack (comma separated)"
                value={editingProject.techStack?.join(", ") || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    techStack: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Partners (comma separated)"
                value={editingProject.partners?.join(", ") || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    partners: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Call to Action"
                value={editingProject.callToAction || ""}
                onChange={(e) => setEditingProject({ ...editingProject, callToAction: e.target.value })}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Demo Link"
                value={editingProject.demoLink || ""}
                onChange={(e) => setEditingProject({ ...editingProject, demoLink: e.target.value })}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingProject.isActive || false}
                  onChange={(e) => setEditingProject({ ...editingProject, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
