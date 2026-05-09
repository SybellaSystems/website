<<<<<<< HEAD
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
        <p>No staff found</p>
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
                  className="border-b hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                >
                  <td className="px-4 py-2">{staff.names}</td>
                  <td className="px-4 py-2">{staff.email}</td>
                  <td className="px-4 py-2">{staff.role}</td>
                  <td className="px-4 py-2">{staff.phone || '-'}</td>
                  <td className="px-4 py-2">
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
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Staff</h2>
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
                className={`w-full border p-2 rounded ${
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
                className="w-full border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (optional)"
                value={editingStaff.phone || ''}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${
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
                className="w-full border p-2 rounded"
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
=======
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Folder, Newspaper } from "lucide-react";
import HeartBeat from './heartBeat'
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";



export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 20,
    projects: 0,
    blogs: 0,
    subscribed: 0,
  });

  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects/');
        setStats(prev => ({
          ...prev,
          projects: res.data.length
        }))
      } catch (err) {
        console.error("Fetching Projects error", err)
      }
    }
    fetchProjects()

    const fetchBlogs = async () => {
      try { 

        const res = await axios.get('/api/blogposts')

        setStats(prev => ({
          ...prev,
          blogs: res.data.data.length
        }))
      } catch (err) {
        console.error("Failed while fetching blogs", err)
      }
    }

    fetchBlogs()

    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('/api/subscribe', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setStats(prev => ({
          ...prev,
          subscribed: response.data.subscribers.length
        }));
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };

    fetchSubscribers();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/signin");
    }

    // 🔹 Replace this with API call to fetch real stats
    // fetch("/api/admin/stats").then(res => res.json()).then(data => setStats(data));
  }, [router]);

  const pieData = [
    { name: "Subscribed Users", value: stats.subscribed },
    { name: "Unsubscribed Users", value: stats.users - stats.subscribed },
  ];

  const barData = [
    { name: "Users", value: stats.users },
    { name: "Projects", value: stats.projects },
    { name: "Blogs", value: stats.blogs },
  ];

  const COLORS = ["#6366F1", "#22C55E"];

  return (
    <div className="p-6">
      <HeartBeat />
      {/* Header */}
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Manage users, blogs, contacts, and staff from here.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <Users className="text-indigo-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-xl font-bold">{stats.users}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <Folder className="text-green-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Projects</p>
            <h2 className="text-xl font-bold">{stats.projects}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4">
          <Newspaper className="text-amber-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Blogs</p>
            <h2 className="text-xl font-bold">{stats.blogs}</h2>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Subscribed Users</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
>>>>>>> 8de9b24de294f15f15fc3cafec3ae240d3f8c2a4
}
