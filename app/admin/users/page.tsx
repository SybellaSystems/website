"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";



interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  subscribedAt?: string;
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
      const res = await fetch("/api/subscribe", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Use the token passed as an argument!
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      if (data.subscribers && Array.isArray(data.subscribers)) {

        setSubscribers(data.subscribers);

      } else {

        toast.error("No subscribers found");

      }
    } catch (err) {
      console.error("Erro occured", err)
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
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'subscribers',
          id: replyModal.subscriber._id,
          subject: replySubject,
          message: replyMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Reply sent!");
        setReplyModal({ open: false });
        setReplyMessage("");
        setReplySubject("");
        alert(data.message)
      } else {
        alert(data.error)
        toast.error(data.message || "Failed to send reply");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      const res = await fetch(`/api/newsletter/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Subscriber deleted");
        useEffect(() => {
          if (token) {
            fetchSubscribers(token);
          }
        }, [token]);
      } else toast.error(data.message || "Failed to delete subscriber");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>

      {loading ? (
        <p>Loading...</p>
      ) : subscribers.length === 0 ? (
        <p>No subscribers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Subscribed At</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{sub.name || "-"}</td>
                  <td className="py-2 px-4">{sub.email}</td>
                  <td className="py-2 px-4">{sub.subscribedAt || "-"}</td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => setReplyModal({ open: true, subscriber: sub })}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-bold mb-4">Reply to {replyModal.subscriber?.email}</h2>
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
  );
}
