'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner' // ✅ use sonner for consistency
import { PlusCircle, Edit, Trash2, Calendar } from 'lucide-react'

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

      if (res.data.success) {
        toast.success('✅ Milestone updated!', { id: toastId })
        setShowUpdateModal({ open: false })
        fetchMilestones()
      }
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to update milestone', { id: toastId })
    }
  }

  // Delete
  const handleDelete = (id: string) => {
    toast.warning('⚠️ Confirm delete?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          const toastId = toast.loading('Deleting...')
          try {
            const res = await axios.delete(`/api/milestones?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.data.success) {
              toast.success('🗑️ Milestone deleted!', { id: toastId })
              fetchMilestones()
            }
          } catch (err) {
            console.error(err)
            toast.error('❌ Failed to delete milestone', { id: toastId })
          }
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          // dismiss the confirmation toast (no-op beyond closing)
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
        <p className="text-gray-500">Loading...</p>
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
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  onClick={() => openUpdateModal(m)}
                >
                  <Edit size={14} /> Update
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(m._id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (Create/Update) */}
      {(showCreateModal || showUpdateModal.open) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-xl w-96 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {showCreateModal ? 'Create Milestone' : 'Update Milestone'}
            </h2>

            {/* Name */}
            <input
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              type="text"
              placeholder="Milestone Name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />

            {/* Years */}
            <input
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              type="number"
              placeholder="Start Year"
              value={formData.startYear}
              onChange={e => setFormData(prev => ({ ...prev, startYear: e.target.value }))}
            />
            <input
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              type="number"
              placeholder="End Year"
              value={formData.endYear}
              onChange={e => setFormData(prev => ({ ...prev, endYear: e.target.value }))}
            />

            {/* Description */}
            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Description"
              rows={3}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowCreateModal(false); setShowUpdateModal({ open: false }) }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreate : handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {showCreateModal ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
