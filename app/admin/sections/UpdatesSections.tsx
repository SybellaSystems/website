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
        <h2 className="text-2xl font-bold text-gray-800">Manage Updates</h2>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsViewOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedUpdate.title}</h3>
            {selectedUpdate.thumbnail && (
              <img
                src={selectedUpdate.thumbnail}
                className="w-full h-48 object-cover rounded-lg mb-4"
                alt=""
              />
            )}
            <p className="text-gray-700 mb-3">{selectedUpdate.description}</p>
            <p className="text-sm text-gray-500">
              <strong>Category:</strong> {selectedUpdate.category}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Author:</strong> {selectedUpdate.author || 'Unknown'}
            </p>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsFormOpen(false)}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Update' : 'Create Update'}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border rounded-lg p-2"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <select
                className="w-full border rounded-lg p-2"
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

              <textarea
                placeholder="Description"
                className="w-full border rounded-lg p-2 h-24"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Author"
                className="w-full border rounded-lg p-2"
                value={formData.author || ''}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />

              <input
                type="url"
                placeholder="Thumbnail URL"
                className="w-full border rounded-lg p-2"
                value={formData.thumbnail || ''}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <label>Active</label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
