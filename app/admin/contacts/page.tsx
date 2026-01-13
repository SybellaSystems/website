'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface Contact {
  _id: string
  name: string
  email: string
  message: string
  company: string
  phone: string
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(10)

  const [replyModal, setReplyModal] = useState<{ open: boolean; contact?: Contact }>({ open: false })
  const [replyMessage, setReplyMessage] = useState("")
  const [replySubject, setReplySubject] = useState("")

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null


  const fetchContacts = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      if (!token) throw new Error("No access token found")
      const res = await axios.get(`/api/contact?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) {
        setContacts(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setTotalItems(res.data.totalItems)
      } else {
        setError(res.data.error || "Failed to fetch contacts")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || err.message || "Error fetching contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts(currentPage)
  }, [token, currentPage])

  const handleReply = async () => {
    if (!replyModal.contact) return
    try {
      const res = await axios.post('/api/reply', {
        type: "contacts",
        id: replyModal.contact._id,
        subject: replySubject,
        message: replyMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data.success) {
        toast.success("Reply sent!")
        setReplyModal({ open: false })
        setReplyMessage("")
        setReplySubject("")
        fetchContacts(currentPage)
      } else {
        toast.error(res.data.error || "Failed to send reply")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Something went wrong")
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-6">
      <h1 className="text-2xl font-bold mb-6 text-dark-blue dark:text-white">Contact Messages</h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading contacts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No contact messages found.</p>
      ) : (
        <>
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            Showing {contacts.length} of {totalItems} contacts
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-dark-surface rounded-xl shadow-md">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Name</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Email</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Company</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Phone</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Message</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Created At</th>
                  <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{contact.name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{contact.email}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{contact.company || '-'}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{contact.phone || '-'}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{contact.message || '-'}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {contact.createdAt && !isNaN(new Date(contact.createdAt).getTime())
                        ? new Date(contact.createdAt).toLocaleString()
                        : '-'}
                    </td>

                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => setReplyModal({ open: true, contact })}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover'
                }`}
              >
                Previous
              </button>

              {renderPageNumbers()}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-bold mb-4">Reply to {replyModal.contact?.email}</h2>
            <input
              type="text"
              placeholder="Subject"
              className="w-full border px-3 py-2 rounded mb-3"
              value={replySubject}
              onChange={e => setReplySubject(e.target.value)}
            />
            <textarea
              placeholder="Message"
              className="w-full border px-3 py-2 rounded mb-3 h-32 resize-none"
              value={replyMessage}
              onChange={e => setReplyMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReplyModal({ open: false })}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}