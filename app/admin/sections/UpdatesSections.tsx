'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Calendar,
  User,
  Edit,
  Trash,
  Eye,
  Plus,
  X,
  Loader2,
  FileText,
  Image,
  Tag,
  CheckCircle,
} from 'lucide-react';

interface Update {
  id?: string;
  title: string;
  category: 'news' | 'announcement' | 'event' | 'other';
  description: string;
  author?: string;
  thumbnail?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function UpdatesSection() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState<Partial<Update>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/updates');
      setUpdates(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      await axios.delete(`/api/updates/${id}`);
      setUpdates((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Failed to delete update.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedUpdate?.id) {
        await axios.put(`/api/updates/${selectedUpdate.id}`, formData);
      } else {
        await axios.post('/api/updates', formData);
      }
      setIsFormOpen(false);
      setFormData({});
      fetchUpdates();
    } catch {
      alert('Failed to save update.');
    }
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setFormData({});
    setIsFormOpen(true);
  };

  const openEditForm = (update: Update) => {
    setIsEditing(true);
    setSelectedUpdate(update);
    setFormData(update);
    setIsFormOpen(true);
  };

  const openViewModal = (update: Update) => {
    setSelectedUpdate(update);
    setIsViewOpen(true);
  };

  return (
    <section className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Manage Updates
        </h2>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Plus className="w-4 h-4" /> Add Update
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-600">Loading updates...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {updates.map((update) => (
            <div
              key={update.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              {update.thumbnail && (
                <img
                  src={update.thumbnail}
                  alt={update.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-semibold text-blue-600">
                    {update.category}
                  </span>
                  {update.isActive ? (
                    <span className="text-xs text-green-600 font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Inactive</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {update.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {update.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {update.author || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(update.createdAt || '').toLocaleDateString()}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => openViewModal(update)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditForm(update)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(update.id!)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedUpdate && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 transition-opacity duration-300"
          onClick={() => setIsViewOpen(false)}
        >
          <div 
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">View Update</h3>
              </div>
              <button
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white hover:rotate-90 duration-200"
                onClick={() => setIsViewOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {selectedUpdate.thumbnail && (
                <img
                  src={selectedUpdate.thumbnail}
                  className="w-full h-64 object-cover rounded-xl mb-4 shadow-md"
                  alt={selectedUpdate.title}
                />
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs uppercase font-semibold">
                  {selectedUpdate.category}
                </span>
                {selectedUpdate.isActive ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold">
                    Inactive
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                {selectedUpdate.title}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {selectedUpdate.description}
              </p>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Author:</span>
                  <span>{selectedUpdate.author || 'Unknown'}</span>
                </div>
                {selectedUpdate.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">Created:</span>
                    <span>{new Date(selectedUpdate.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 transition-opacity duration-300"
          onClick={() => setIsFormOpen(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Update' : 'Create Update'}
                </h3>
              </div>
              <button
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white hover:rotate-90 duration-200"
                onClick={() => setIsFormOpen(false)}
                type="button"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter update title"
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Category
                </label>
                <select
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white cursor-pointer"
                  value={formData.category || 'news'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Update['category'],
                    })
                  }
                >
                  <option value="news">News</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Description
                </label>
                <textarea
                  placeholder="Enter update description..."
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  rows={5}
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Author and Thumbnail - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 text-blue-600" />
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="Author name"
                    className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    value={formData.author || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Image className="w-4 h-4 text-blue-600" />
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    value={formData.thumbnail || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <label 
                  htmlFor="isActive" 
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isEditing ? 'Update Update' : 'Create Update'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
