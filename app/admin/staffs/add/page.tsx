"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ use sonner
import { User, Mail, Lock, Phone, Briefcase } from "lucide-react";

export default function AddStaffPage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [form, setForm] = useState({
    names: "",
    email: "",
    password: "",
    role: "marketing",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating staff...");

    try {
      const res = await axios.post("/api/staff/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "🎉 Staff created successfully!", {
        id: toastId,
      });

      setTimeout(() => {
        router.push("/admin/staffs"); // redirect after short delay
      }, 500);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to create staff", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          ➕ Add New Staff
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              name="names"
              placeholder="Enter full name"
              value={form.names}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="staff@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Phone size={16} /> Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Briefcase size={16} /> Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="executive">Executive</option>
              <option value="superadmin">Super Admin</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
              <option value="accountant">Accountant</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Staff"}
          </button>
        </form>
      </div>
    </div>
  );
}
