"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { MessageSquare, Trash2 } from "lucide-react";



interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  subscribedAt?: string;
  subscribeAt?: string; // Support both field names for compatibility
}

export default function AdminUsersPage() {
  // const [token, setToken] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState<{ open: boolean; subscriber?: Subscriber }>({ open: false });
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    console.log("Value retrieved from localStorage:", storedToken);
    setToken(storedToken);
  }, []);

  const fetchSubscribers = async (accessToken: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Use the token passed as an argument!
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      if (data.success && data.subscribers && Array.isArray(data.subscribers)) {
        setSubscribers(data.subscribers);
      } else {
        toast.error("No subscribers found");
      }
    } catch (err) {
      console.error("Error occurred", err);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubscribers(token);
    }
  }, [token]);


  const handleReply = async () => {
    if (!replyModal.subscriber) return;
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    if (!replySubject.trim() || !replyMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }
    
    const toastId = toast.loading("Sending reply...");
    try {
      const res = await fetch("/api/newsletter/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: replyModal.subscriber._id,
          subject: replySubject,
          message: replyMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Reply sent successfully!", { 
          id: toastId,
          description: data.message || "The email has been sent to the subscriber."
        });
        setReplyModal({ open: false });
        setReplyMessage("");
        setReplySubject("");
      } else {
        toast.error("Failed to send reply", { 
          id: toastId,
          description: data.message || data.error || "Please try again."
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send reply", { 
        id: toastId,
        description: err.message || "Something went wrong. Please try again."
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    toast.warning("Are you sure you want to delete this subscriber?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting subscriber...");
          try {
            const res = await fetch(`/api/newsletter/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            if (res.ok && data.success) {
              toast.success("Subscriber deleted successfully!", { id: toastId });
              if (token) {
                fetchSubscribers(token);
              }
            } else {
              toast.error(data.message || "Failed to delete subscriber", { 
                id: toastId,
                description: data.error || 'Please try again'
              });
            }
          } catch (err) {
            console.error(err);
            toast.error("Something went wrong", { id: toastId });
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-dark-bg min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Newsletter Subscribers
      </h1>

      {loading ? (
        <Loader size="lg" text="Loading subscribers..." />
      ) : subscribers.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No subscribers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-dark-surface rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Subscribed At</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => {
                const formatDate = (dateString?: string) => {
                  if (!dateString) return "-";
                  try {
                    const date = new Date(dateString);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } catch {
                    return dateString;
                  }
                };
                // Handle both subscribeAt and subscribedAt field names
                const subscribeDate = sub.subscribedAt || (sub as any).subscribeAt;
                return (
                <tr
                  key={sub._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800/80"
                >
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{sub.email}</td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                    {formatDate(subscribeDate)}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => setReplyModal({ open: true, subscriber: sub })}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors flex items-center justify-center"
                      title="Reply to subscriber"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors flex items-center justify-center"
                      title="Delete subscriber"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Reply to {replyModal.subscriber?.email}
            </h2>
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded mb-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              value={replySubject}
              onChange={e => setReplySubject(e.target.value)}
            />
            <textarea
              placeholder="Message"
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded mb-3 h-32 resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              value={replyMessage}
              onChange={e => setReplyMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReplyModal({ open: false })}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-900"
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
  );
}
