"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/Loader";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ names: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]); // array for multiple messages

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/staff/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          names: res.data.names,
          email: res.data.email,
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleProfileUpdate = async () => {
    if (!user) return;
    const toastId = toast.loading("Updating profile...");
    const cleanForm = JSON.parse(JSON.stringify(form));
    try {
      const res = await axios.patch(`/api/staff/self/${user.id}`, cleanForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status >= 200 && res.status < 300) {
        setUser(res.data);
        toast.success("✅ Profile updated successfully!", { id: toastId });
        setMessage("Profile updated successfully!");
      } else {
        toast.error("❌ Profile update failed", { id: toastId });
        setMessage("Profile update failed!");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to update profile.";
      toast.error("❌ Failed to update profile", { 
        id: toastId,
        description: errorMsg
      });
      setMessage(errorMsg);
      console.error(err);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user) return;
    setPasswordError([]); // clear previous errors

    // Optional: Frontend validation
    const frontendErrors = [];
    if (!/[A-Z]/.test(passwordForm.newPassword)) frontendErrors.push("Must contain uppercase letter");
    if (!/[\W_]/.test(passwordForm.newPassword)) frontendErrors.push("Must contain special character");
    if (frontendErrors.length) {
      setPasswordError(frontendErrors);
      return;
    }

    const toastId = toast.loading("Updating password...");
    try {
      const res = await axios.patch(
        `/api/staff/self/password/${user.id}`,
        { ...passwordForm },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );

      if (res.status >= 200 && res.status < 300) {
        toast.success("✅ Password updated successfully!", { id: toastId, description: res.data.message });
        setMessage(res.data.message);
        setPasswordForm({ oldPassword: "", newPassword: "" }); // reset form
      } else {
        toast.error("❌ Failed to update password", { id: toastId });
        setMessage("Password update failed!");
      }
    } catch (err: any) {
      // Map backend Zod errors to messages
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const messages = err.response.data.errors.map((e: any) => e.message);
        setPasswordError(messages);
      } else if (err.response?.data?.error) {
        setPasswordError([err.response.data.error]);
      } else {
        setPasswordError(["Failed to update password."]);
      }
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center mt-10"><Loader size="lg" text="Loading settings..." /></div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* Profile Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">My Profile</h2>

        <div className="bg-gray-50 p-4 rounded border mb-4">
          <p>
            <strong>Role:</strong> {user.role}
          </p>

          {/* Permissions */}
          {user.permissions?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold mb-2">Permissions:</p>
              <ul className="list-disc list-inside text-gray-700">
                {user.permissions.map((perm: string, idx: number) => (
                  <li key={idx}>{perm}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Name"
          value={form.names}
          onChange={(e) => setForm({ ...form, names: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          onClick={handleProfileUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>

      <hr className="my-6" />

      {/* Password Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Change Password</h2>
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Current Password"
          value={passwordForm.oldPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="New Password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
        />
        {/* Display password validation errors */}
        {passwordError.length > 0 && (
          <div className="text-red-600 mt-1">
            {passwordError.map((errMsg, idx) => (
              <p key={idx}>{errMsg}</p>
            ))}
          </div>
        )}
        <button
          onClick={handlePasswordUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </div>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
