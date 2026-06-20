"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ use sonner
import { User, Mail, Lock, Phone, Briefcase } from "lucide-react";
import { FormValidator, ValidationErrors } from "@/lib/formValidation";

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
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate name
    const nameError = FormValidator.validateRequired(form.names, "Full Name");
    if (nameError) newErrors.names = nameError;

    // Validate email
    const emailError = FormValidator.validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    // Validate password
    const passwordError = FormValidator.validatePassword(form.password, 6);
    if (passwordError) newErrors.password = passwordError;

    // Validate phone (optional)
    if (form.phone) {
      const phoneError = FormValidator.validatePhone(form.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Creating staff...");

    try {
      const res = await axios.post("/api/staff/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Staff created successfully!", {
        id: toastId,
      });

      setTimeout(() => {
        router.push("/admin/staffs"); // redirect after short delay
      }, 500);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to create staff";
      toast.error(errorMessage, {
        id: toastId,
        description: err.response?.data?.errors ? "Please check the form fields" : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full border p-3 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none dark:bg-slate-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 flex items-center gap-2">
          ➕ Add New Staff
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              name="names"
              placeholder="Enter full name"
              value={form.names}
              onChange={handleChange}
              className={`${fieldClass} ${errors.names ? "border-red-500" : ""}`}
            />
            {errors.names && (
              <p className="text-red-500 text-sm mt-1">{errors.names}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="staff@example.com"
              value={form.email}
              onChange={handleChange}
              className={`${fieldClass} ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              className={`${fieldClass} ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Phone size={16} /> Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Phone number (optional)"
              value={form.phone}
              onChange={handleChange}
              className={`${fieldClass} ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Briefcase size={16} /> Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={fieldClass}
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
