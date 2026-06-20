'use client'

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import Loader from '@/components/Loader'

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
    const [imagePreview, setImagePreview] = useState<string>('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [errors, setErrors] = useState<{ name?: string; role?: string; image?: string }>({})
    const fileInputRef = useRef<HTMLInputElement>(null)
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

    // Validation function for required fields only
    const validateForm = (): boolean => {
        const newErrors: { name?: string; role?: string; image?: string } = {}

        // Validate name (required)
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        // Validate role (required)
        if (!formData.role.trim()) {
            newErrors.role = 'Role is required'
        }

        // Validate image (required)
        if (!formData.image) {
            newErrors.image = 'Profile image is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageUpload = async (file: File) => {
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
            // Set form validation error - show form error, not toast
            setErrors(prev => ({
                ...prev,
                image: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.'
            }))
            // Clear preview and selected file on validation failure
            // Only clear if no existing image (create mode), otherwise keep existing image
            if (!formData.image) {
                setImagePreview('')
            }
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            // Set form validation error - show form error, not toast
            setErrors(prev => ({
                ...prev,
                image: 'File size too large. Maximum size is 5MB.'
            }))
            // Clear preview and selected file on validation failure
            // Only clear if no existing image (create mode), otherwise keep existing image
            if (!formData.image) {
                setImagePreview('')
            }
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setUploadingImage(true)
        try {
            const uploadFormData = new FormData()
            uploadFormData.append('image', file)

            const res = await axios.post('/api/team/upload', uploadFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.success) {
                setFormData(prev => ({ ...prev, image: res.data.imageUrl }))
                setImagePreview(res.data.imageUrl)
                // Clear any image-related errors on successful upload
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.image
                    return newErrors
                })
                toast.success('Image uploaded successfully!')
            }
        } catch (err: any) {
            console.error(err)
            // Clear image error FIRST (unconditionally) - only show toast, not form validation error
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors.image
                return newErrors
            })
            toast.error(err.response?.data?.message || 'Failed to upload image')
            // Clear preview and selected file on upload failure
            // Restore original image if in update mode, otherwise clear
            const originalImage = formData.image || ''
            setImagePreview(originalImage)
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
        } finally {
            setUploadingImage(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            // Upload the file (preview will be set only after successful upload)
            handleImageUpload(file)
        }
    }

    const handleCreate = async () => {
        if (!validateForm()) {
            return
        }

        try {
            const res = await axios.post('/api/team', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                toast.success('Team member created!')
                setShowCreateModal(false)
                setFormData({ name: '', role: '', image: '', linkedin: '', twitter: '', github: '' })
                setImagePreview('')
                setSelectedFile(null)
                setErrors({})
                if (fileInputRef.current) fileInputRef.current.value = ''
                fetchMembers()
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to create team member')
        }
    }

    const handleUpdate = async () => {
        if (!showUpdateModal.member) return
        if (!validateForm()) {
            return
        }

        const toastId = toast.loading('Updating team member...')
        try {
            const res = await axios.patch(`/api/team/${showUpdateModal.member._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if ((res.status >= 200 && res.status < 300) && (res.data?.success !== false)) {
                toast.success('Team member updated successfully!', { id: toastId })
                setShowUpdateModal({ open: false })
                setImagePreview('')
                setSelectedFile(null)
                setErrors({})
                if (fileInputRef.current) fileInputRef.current.value = ''
                fetchMembers()
            } else {
                toast.error('Failed to update team member', { id: toastId })
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to update team member')
        }
    }

    const handleDelete = async (id: string) => {
        toast.warning('Are you sure you want to delete this team member?', {
            action: {
                label: 'Delete',
                onClick: async () => {
                    const toastId = toast.loading('Deleting team member...')
                    try {
                        const res = await axios.delete(`/api/team/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                        // Show success if request succeeds (status 200-299) and API confirms success
                        if ((res.status >= 200 && res.status < 300) && (res.data?.success !== false)) {
                            toast.success('Team member deleted successfully!', { id: toastId })
                            fetchMembers()
                        } else {
                            toast.error('Failed to delete team member', { 
                                id: toastId,
                                description: res.data?.message || 'Please try again'
                            })
                        }
                    } catch (err: any) {
                        console.error(err)
                        toast.error('Failed to delete team member', { 
                            id: toastId,
                            description: err.response?.data?.message || 'Please try again'
                        })
                    }
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => toast.dismiss()
            }
        })
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
        setImagePreview(m.image)
        setErrors({})
        setShowUpdateModal({ open: true, member: m })
    }

    const resetForm = () => {
        setFormData({ name: '', role: '', image: '', linkedin: '', twitter: '', github: '' })
        setImagePreview('')
        setSelectedFile(null)
        setErrors({})
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Team Members</h1>
                <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
                    onClick={() => {
                        resetForm()
                        setShowCreateModal(true)
                    }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Member
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader size="lg" text="Loading team members..." />
                </div>
            ) : members.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No team members found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map(m => (
                        <div key={m._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div className="relative overflow-hidden">
                                <img 
                                    src={m.image} 
                                    alt={m.name} 
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/profile.webp'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-5">
                                <h2 className="font-bold text-xl mb-1 text-gray-800 dark:text-gray-100">{m.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{m.role}</p>
                                {(m.linkedin || m.twitter || m.github) && (
                                    <div className="flex gap-3 mb-4 flex-wrap">
                                        {m.linkedin && (
                                            <a 
                                                href={m.linkedin} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                title="LinkedIn"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                </svg>
                                            </a>
                                        )}
                                        {m.twitter && (
                                            <a 
                                                href={m.twitter} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-blue-400 hover:text-blue-600 transition-colors"
                                                title="Twitter"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                </svg>
                                            </a>
                                        )}
                                        {m.github && (
                                            <a 
                                                href={m.github} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                                title="GitHub"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        onClick={() => openUpdateModal(m)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                        onClick={() => handleDelete(m._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4" onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                    setErrors({})
                }}>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add Team Member</h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                    resetForm()
                                    setErrors({})
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Profile Image <span className="text-red-500">*</span>
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
                                            id="image-upload-create"
                                        />
                                        <label
                                            htmlFor="image-upload-create"
                                            className={`inline-flex items-center px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200 ${
                                                errors.image 
                                                    ? 'border-red-500 dark:border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            } ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingImage ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                                </>
                                            )}
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPEG, PNG, WebP, or GIF (Max 5MB)</p>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠️</span> {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 ${
                                        errors.name 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData(prev => ({ ...prev, name: e.target.value }))
                                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                                    }}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 ${
                                        errors.role 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                    placeholder="e.g., Software Developer, Designer"
                                    value={formData.role}
                                    onChange={e => {
                                        setFormData(prev => ({ ...prev, role: e.target.value }))
                                        if (errors.role) setErrors(prev => ({ ...prev, role: undefined }))
                                    }}
                                />
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Social Links - Optional */}
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Links (Optional)</p>
                                
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">LinkedIn</label>
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                                        placeholder="https://linkedin.com/in/username"
                                        value={formData.linkedin}
                                        onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Twitter</label>
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                                        placeholder="https://twitter.com/username"
                                        value={formData.twitter}
                                        onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">GitHub</label>
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                                        placeholder="https://github.com/username"
                                        value={formData.github}
                                        onChange={e => setFormData(prev => ({ ...prev, github: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                    resetForm()
                                    setErrors({})
                                }}
                                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal.open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4" onClick={() => {
                    setShowUpdateModal({ open: false })
                    resetForm()
                    setErrors({})
                }}>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Update Team Member</h2>
                            <button
                                onClick={() => {
                                    setShowUpdateModal({ open: false })
                                    resetForm()
                                    setErrors({})
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Profile Image <span className="text-red-500">*</span>
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
                                            id="image-upload-update"
                                        />
                                        <label
                                            htmlFor="image-upload-update"
                                            className={`inline-flex items-center px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200 ${
                                                errors.image 
                                                    ? 'border-red-500 dark:border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            } ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingImage ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                                </>
                                            )}
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPEG, PNG, WebP, or GIF (Max 5MB)</p>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠️</span> {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 ${
                                        errors.name 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData(prev => ({ ...prev, name: e.target.value }))
                                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                                    }}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 ${
                                        errors.role 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                    placeholder="e.g., Software Developer, Designer"
                                    value={formData.role}
                                    onChange={e => {
                                        setFormData(prev => ({ ...prev, role: e.target.value }))
                                        if (errors.role) setErrors(prev => ({ ...prev, role: undefined }))
                                    }}
                                />
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Social Links - Optional */}
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Links (Optional)</p>
                                
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">LinkedIn</label>
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                                        placeholder="https://linkedin.com/in/username"
                                        value={formData.linkedin}
                                        onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Twitter</label>
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                                        placeholder="https://twitter.com/username"
                                        value={formData.twitter}
                                        onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">GitHub</label>
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                                        placeholder="https://github.com/username"
                                        value={formData.github}
                                        onChange={e => setFormData(prev => ({ ...prev, github: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    setShowUpdateModal({ open: false })
                                    resetForm()
                                    setErrors({})
                                }}
                                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                            >
                                Update Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
