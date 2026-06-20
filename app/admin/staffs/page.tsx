'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import Loader from '@/components/Loader'
import { FormValidator, ValidationErrors } from '@/lib/formValidation'
import { Pencil, Trash2 } from 'lucide-react'

interface Staff {
  id: string
  names: string
  email: string
  role: string
  phone?: string
  isActive?: boolean
}

export default function AdminStaffPage() {
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [newStaff, setNewStaff] = useState({
    names: '',
    email: '',
    password: '',
    role: 'executive',
    phone: '',
  })
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  const fetchStaffs = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/staff', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStaffs(res.data)
    } catch (err: any) {
      console.error(err)
      toast.error(
        err.response?.data?.message || 'Failed to fetch staff members'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchStaffs()
  }, [token])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (editingStaff) {
      setEditingStaff({ ...editingStaff, [name]: value })
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" })
      }
    } else {
      setNewStaff({ ...newStaff, [name]: value })
    }
  }

  const validateEditForm = (): boolean => {
    if (!editingStaff) return false
    const newErrors: ValidationErrors = {}

    // Validate name
    const nameError = FormValidator.validateRequired(editingStaff.names, "Full Name")
    if (nameError) newErrors.names = nameError

    // Validate phone (optional)
    if (editingStaff.phone) {
      const phoneError = FormValidator.validatePhone(editingStaff.phone)
      if (phoneError) newErrors.phone = phoneError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/staff/create', newStaff, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success(res.data.message)
      setNewStaff({ names: '', email: '', password: '', role: '', phone: '' })
      fetchStaffs()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to create staff')
    }
  }

  const handleUpdateStaff = async () => {
    if (!editingStaff) return
    
    // Validate form before submission
    if (!validateEditForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    const toastId = toast.loading('Updating staff member...')
    try {
      const { id, email, ...updateData } = editingStaff
      const res = await axios.patch(`/api/staff?id=${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status >= 200 && res.status < 300) {
        toast.success('Staff updated successfully!', { id: toastId })
        setEditingStaff(null)
        setShowModal(false)
        fetchStaffs()
      } else {
        toast.error('Failed to update staff', { id: toastId })
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to update staff', { 
        id: toastId,
        description: err.response?.data?.message || 'Please try again'
      })
    }
  }

  const handleDeleteStaff = async (id: string) => {
    toast.warning('Are you sure you want to delete this staff member?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          const toastId = toast.loading('Deleting staff member...')
          try {
            const res = await axios.delete(`/api/staff/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (res.status >= 200 && res.status < 300) {
              toast.success('Staff deleted successfully!', { id: toastId })
              fetchStaffs()
            } else {
              toast.error('Failed to delete staff', { id: toastId })
            }
          } catch (err: any) {
            console.error(err)
            toast.error('Failed to delete staff', { 
              id: toastId,
              description: err.response?.data?.message || 'Please try again'
            })
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.dismiss(),
      },
    })
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-dark-bg">
      <h1 className="text-2xl font-bold mb-6 text-dark-blue dark:text-white">
        Staff Management
      </h1>

      {/* View Staff */}
      {loading ? (
        <Loader size="lg" text="Loading staff members..." />
      ) : staffs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No staff found</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-dark-surface rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-blue-600 dark:bg-blue-700">
              <tr>
                <th className="px-4 py-2 text-left text-white font-semibold">Name</th>
                <th className="px-4 py-2 text-left text-white font-semibold">Email</th>
                <th className="px-4 py-2 text-left text-white font-semibold">Role</th>
                <th className="px-4 py-2 text-left text-white font-semibold">Phone</th>
                <th className="px-4 py-2 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{staff.names}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{staff.email}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{staff.role}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{staff.phone || '-'}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors flex items-center justify-center"
                        onClick={() => {
                          setEditingStaff(staff)
                          setShowModal(true)
                        }}
                        title="Edit staff member"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors flex items-center justify-center"
                        onClick={() => handleDeleteStaff(staff.id)}
                        title="Delete staff member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && editingStaff && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Staff</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateStaff()
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="names"
                placeholder="Full Name"
                value={editingStaff.names}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border-gray-300 dark:border-gray-600 ${
                  errors.names ? "border-red-500" : ""
                }`}
              />
              {errors.names && (
                <p className="text-red-500 text-sm mt-1">{errors.names}</p>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={editingStaff.email}
                disabled
                className="w-full border p-2 rounded bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (optional)"
                value={editingStaff.phone || ''}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border-gray-300 dark:border-gray-600 ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              <select
                name="role"
                value={editingStaff.role}
                onChange={handleInputChange}
                className="w-full border p-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                <option value="executive">Executive</option>
                <option value="superadmin">Super Admin</option>
                <option value="manager">Manager</option>
                <option value="sales">Sales</option>
                <option value="accountant">Accountant</option>
              </select>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStaff(null)
                    setShowModal(false)
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
