'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner' // ✅ use sonner for consistency
import { PlusCircle, Edit, Trash2, Calendar, X, Tag, FileText, Pencil } from 'lucide-react'
import Loader from '@/components/Loader'

interface Milestone {
  _id: string
  name: string
  description: string
  startYear: number
  endYear: number
}

export default function MilestonesSection() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState<{ open: boolean; milestone?: Milestone }>({ open: false })
  const [formData, setFormData] = useState({ name: '', description: '', startYear: '', endYear: '' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  // Fetch milestones
  const fetchMilestones = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/milestones', { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.success) setMilestones(res.data.milestones)
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to fetch milestones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMilestones() }, [])

  // Create
  const handleCreate = async () => {
    const toastId = toast.loading('Creating milestone...')
    try {
      const res = await axios.post('/api/milestones', {
        name: formData.name,
        description: formData.description,
        startYear: Number(formData.startYear),
        endYear: Number(formData.endYear),
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (res.data.success) {
        toast.success('🎉 Milestone created!', { id: toastId })
        setShowCreateModal(false)
        setFormData({ name: '', description: '', startYear: '', endYear: '' })
        fetchMilestones()
      }
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to create milestone', { id: toastId })
    }
  }

  // Update
  const handleUpdate = async () => {
    if (!showUpdateModal.milestone) return
    const toastId = toast.loading('Updating milestone...')
    try {
      const res = await axios.patch(`/api/milestones/${showUpdateModal.milestone._id}`, {
        name: formData.name,
        description: formData.description,
        startYear: Number(formData.startYear),
        endYear: Number(formData.endYear),
      }, { headers: { Authorization: `Bearer ${token}` } })

      if ((res.status >= 200 && res.status < 300) && (res.data?.success !== false)) {
        toast.success('✅ Milestone updated successfully!', { id: toastId })
        setShowUpdateModal({ open: false })
        fetchMilestones()
      } else {
        toast.error('❌ Failed to update milestone', { id: toastId })
      }
    } catch (err: any) {
      console.error(err)
      toast.error('❌ Failed to update milestone', { 
        id: toastId,
        description: err.response?.data?.message || 'Please try again'
      })
    }
  }

  // Delete
  const handleDelete = (id: string) => {
    toast.warning('⚠️ Are you sure you want to delete this milestone?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          const toastId = toast.loading('Deleting milestone...')
          try {
            const res = await axios.delete(`/api/milestones?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
            // Show success if request succeeds
            if (res.status >= 200 && res.status < 300 && res.data.success) {
              toast.success('✅ Milestone deleted successfully!', { id: toastId })
              fetchMilestones()
            } else {
              toast.error('❌ Failed to delete milestone', { id: toastId })
            }
          } catch (err: any) {
            console.error(err)
            toast.error('❌ Failed to delete milestone', { 
              id: toastId,
              description: err.response?.data?.message || 'Please try again'
            })
          }
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.dismiss()
        }
      }
    })
  }

  const openUpdateModal = (m: Milestone) => {
    setFormData({ name: m.name, description: m.description, startYear: String(m.startYear), endYear: String(m.endYear) })
    setShowUpdateModal({ open: true, milestone: m })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-indigo-600" /> Milestones
        </h1>
        <button
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle size={18} /> Create Milestone
        </button>
      </div>

      {/* List */}
      {loading ? (
        <Loader size="lg" text="Loading milestones..." />
      ) : milestones.length === 0 ? (
        <p className="text-gray-500">No milestones found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {milestones.map(m => (
            <div
              key={m._id}
              className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <h2 className="font-bold text-xl text-gray-800 dark:text-white">{m.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{m.description}</p>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p>📅 Start: {m.startYear}</p>
                <p>🏁 End: {m.endYear}</p>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors flex items-center justify-center"
                  onClick={() => openUpdateModal(m)}
                  title="Edit milestone"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors flex items-center justify-center"
                  onClick={() => handleDelete(m._id)}
                  title="Delete milestone"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (Create/Update) */}
      {(showCreateModal || showUpdateModal.open) && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 transition-opacity duration-300"
          onClick={() => { setShowCreateModal(false); setShowUpdateModal({ open: false }) }}
        >
          <div 
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {showCreateModal ? 'Create Milestone' : 'Update Milestone'}
                </h2>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); setShowUpdateModal({ open: false }) }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white hover:rotate-90 duration-200"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              {/* Milestone Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Milestone Name
                </label>
                <input
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  type="text"
                  placeholder="Enter milestone name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Years - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Start Year
                  </label>
                  <input
                    className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    type="number"
                    placeholder="2024"
                    value={formData.startYear}
                    onChange={e => setFormData(prev => ({ ...prev, startYear: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    End Year
                  </label>
                  <input
                    className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    type="number"
                    placeholder="2025"
                    value={formData.endYear}
                    onChange={e => setFormData(prev => ({ ...prev, endYear: e.target.value }))}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Description
                </label>
                <textarea
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all resize-none bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter milestone description..."
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => { setShowCreateModal(false); setShowUpdateModal({ open: false }) }}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={showCreateModal ? handleCreate : handleUpdate}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {showCreateModal ? 'Create Milestone' : 'Update Milestone'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
