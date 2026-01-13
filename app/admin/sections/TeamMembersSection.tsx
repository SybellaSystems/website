'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface Member {
    _id: string
    name: string
    role: string
    image: string
    linkedin?: string
    twitter?: string
    github?: string
}

export default function TeamMembersSection() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState<{ open: boolean; member?: Member }>({ open: false })
    const [formData, setFormData] = useState({ name: '', role: '', image: '', linkedin: '', twitter: '', github: '' })
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

    const fetchMembers = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/team')
            if (res.data.success) setMembers(res.data.members)
        } catch (err) {
            console.error(err)
            toast.error('Failed to fetch team members')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMembers() }, [])

    const handleCreate = async () => {
        try {
            const res = await axios.post('/api/team', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                toast.success('Team member created!')
                setShowCreateModal(false)
                setFormData({ name: '', role: '', image: '', linkedin: '', twitter: '', github: '' })
                fetchMembers()
            }
        } catch (err) {
            console.error(err)
            toast.error('Failed to create team member')
        }
    }

    const handleUpdate = async () => {
        if (!showUpdateModal.member) return
        try {
            const res = await axios.patch(`/api/team/${showUpdateModal.member._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                toast.success('Team member updated!')
                setShowUpdateModal({ open: false })
                fetchMembers()
            }
        } catch (err) {
            console.error(err)
            toast.error('Failed to update team member')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return
        try {
            const res = await axios.delete(`/api/team/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.data.success) {
                toast.success('Team member deleted!')
                fetchMembers()
            }
        } catch (err) {
            console.error(err)
            toast.error('Failed to delete team member')
        }
    }

    const openUpdateModal = (m: Member) => {
        setFormData({
            name: m.name,
            role: m.role,
            image: m.image,
            linkedin: m.linkedin || '',
            twitter: m.twitter || '',
            github: m.github || ''
        })
        setShowUpdateModal({ open: true, member: m })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Add Member
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : members.length === 0 ? (
                <p>No team members found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {members.map(m => (
                        <div key={m._id} className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow hover:shadow-md transition">
                            <img src={m.image} alt={m.name} className="w-full h-48 object-cover rounded-md mb-3" />
                            <h2 className="font-bold text-lg">{m.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300">{m.role}</p>
                            <div className="mt-2 flex gap-2 text-sm">
                                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-blue-600">LinkedIn</a>}
                                {m.twitter && <a href={m.twitter} target="_blank" rel="noreferrer" className="text-blue-400">Twitter</a>}
                                {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="text-gray-800 dark:text-white">GitHub</a>}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="px-3 py-1 bg-blue-900 text-white rounded hover:bg-yellow-600"
                                    onClick={() => openUpdateModal(m)}
                                >
                                    Update
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(m._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Role"
                            value={formData.role}
                            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="LinkedIn"
                            value={formData.linkedin}
                            onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Twitter"
                            value={formData.twitter}
                            onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="GitHub"
                            value={formData.github}
                            onChange={e => setFormData(prev => ({ ...prev, github: e.target.value }))}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal.open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Update Team Member</h2>
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Role"
                            value={formData.role}
                            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="LinkedIn"
                            value={formData.linkedin}
                            onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="Twitter"
                            value={formData.twitter}
                            onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder="GitHub"
                            value={formData.github}
                            onChange={e => setFormData(prev => ({ ...prev, github: e.target.value }))}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowUpdateModal({ open: false })} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-yellow-600">Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
