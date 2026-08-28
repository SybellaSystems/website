"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import {
  Search,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  CalendarDays,
  Reply,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Inbox,
} from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const limit = 10;

  const [search, setSearch] = useState("");

  const [replyModal, setReplyModal] = useState<{
    open: boolean;
    contact?: Contact;
  }>({
    open: false,
  });

  const [replyMessage, setReplyMessage] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [sending, setSending] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No access token found");
      }

      const res = await axios.get(
        `/api/contact?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setContacts(res.data.data || []);
        setCurrentPage(res.data.currentPage || page);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0);
      } else {
        setError(res.data.error || "Failed to fetch contacts");
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          err.message ||
          "Error fetching contacts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return contacts;

    return contacts.filter((contact) => {
      return (
        contact.name?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.message?.toLowerCase().includes(query)
      );
    });
  }, [contacts, search]);

  const handleReply = async () => {
    if (!replyModal.contact) return;

    if (!replySubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setSending(true);

      const res = await axios.post(
        "/api/reply",
        {
          type: "contacts",
          id: replyModal.contact._id,
          subject: replySubject,
          message: replyMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Reply sent successfully!");

        closeReplyModal();

        fetchContacts(currentPage);
      } else {
        toast.error(
          res.data.error || "Failed to send reply"
        );
      }
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong"
      );
    } finally {
      setSending(false);
    }
  };

  const closeReplyModal = () => {
    setReplyModal({ open: false });
    setReplyMessage("");
    setReplySubject("");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
              <Inbox className="h-4 w-4" />
              <span>Admin</span>
              <span>/</span>
              <span>Contacts</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Contact Messages
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage enquiries and respond to people contacting Sybella
              Systems.
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Total Messages
              </p>

              <p className="text-lg font-bold text-gray-900">
                {totalItems}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search / Toolbar */}
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredContacts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {totalItems}
          </span>{" "}
          messages
        </div>
      </div>

      {/* Main content */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 shadow-sm">
          <Loader size="lg" text="Loading contacts..." />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            onClick={() => fetchContacts(currentPage)}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <Inbox className="h-6 w-6 text-gray-400" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No messages found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {search
              ? "Try changing your search."
              : "There are currently no contact messages."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Company
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Message
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Received
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="group transition hover:bg-gray-50/70"
                    >
                      {/* Contact */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                            {contact.name
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {contact.name}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />

                              <p className="truncate text-xs text-gray-500">
                                {contact.email}
                              </p>
                            </div>

                            {contact.phone && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />

                                <p className="text-xs text-gray-500">
                                  {contact.phone}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-5">
                        {contact.company ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {contact.company}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* Message */}
                      <td className="max-w-md px-6 py-5">
                        <p
                          className="line-clamp-2 text-sm leading-6 text-gray-600"
                          title={contact.message}
                        >
                          {contact.message || "No message"}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-400" />

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {formatDate(contact.createdAt)}
                            </p>

                            <p className="text-xs text-gray-400">
                              {formatTime(contact.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            setReplyModal({
                              open: true,
                              contact,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          <Reply className="h-3.5 w-3.5" />
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 lg:hidden">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                      {contact.name
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {contact.name}
                      </h3>

                      <p className="truncate text-xs text-gray-500">
                        {contact.email}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                    NEW
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  {contact.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {contact.company}
                    </div>
                  )}

                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(contact.createdAt)}{" "}
                    {formatTime(contact.createdAt)}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {contact.message || "No message"}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setReplyModal({
                      open: true,
                      contact,
                    })
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <button
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Reply to contact
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {replyModal.contact?.email}
                </p>
              </div>

              <button
                onClick={closeReplyModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter email subject"
                  value={replySubject}
                  onChange={(e) =>
                    setReplySubject(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  placeholder="Write your reply..."
                  value={replyMessage}
                  onChange={(e) =>
                    setReplyMessage(e.target.value)
                  }
                  className="h-36 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <button
                onClick={closeReplyModal}
                disabled={sending}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReply}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}