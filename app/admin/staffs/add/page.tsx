"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  ArrowLeft,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { FormValidator, ValidationErrors } from "@/lib/formValidation";

export default function AddStaffPage() {
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const nameError = FormValidator.validateRequired(
      form.names,
      "Full Name"
    );

    if (nameError) newErrors.names = nameError;

    const emailError = FormValidator.validateEmail(form.email);

    if (emailError) newErrors.email = emailError;

    const passwordError = FormValidator.validatePassword(
      form.password,
      6
    );

    if (passwordError) newErrors.password = passwordError;

    if (form.phone) {
      const phoneError = FormValidator.validatePhone(form.phone);

      if (phoneError) newErrors.phone = phoneError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Creating staff...");

    try {
      const res = await axios.post("/api/staff/create", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        res.data.message || "Staff created successfully!",
        {
          id: toastId,
        }
      );

      setTimeout(() => {
        router.push("/admin/staffs");
      }, 500);
    } catch (err: any) {
      console.error(err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create staff";

      toast.error(errorMessage, {
        id: toastId,
        description: err.response?.data?.errors
          ? "Please check the form fields"
          : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
    }`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Staff
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <UserPlus size={16} />
                <span>Staff Management</span>
                <span>•</span>
                <span>Add Staff</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Add New Staff
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create an account and assign a role to a new team member.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 sm:flex">
              <ShieldCheck
                size={20}
                className="text-emerald-600"
              />

              <div>
                <p className="text-xs font-semibold text-emerald-700">
                  Secure account
                </p>
                <p className="text-xs text-emerald-600">
                  Protected staff access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Form header */}
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserPlus size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Staff Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter the details below to create the staff account.
                  </p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ================= NAME ================= */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="names"
                      placeholder="Enter full name"
                      value={form.names}
                      onChange={handleChange}
                      className={inputClass("names")}
                    />
                  </div>

                  {errors.names && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.names}
                    </p>
                  )}
                </div>

                {/* ================= EMAIL ================= */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="staff@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass("email")}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* ================= PASSWORD ================= */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass("password")}
                    />
                  </div>

                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.password}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">
                      Use at least 6 characters for the password.
                    </p>
                  )}
                </div>

                {/* ================= PHONE ================= */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass("phone")}
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* ================= ROLE ================= */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Staff Role
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="executive">
                        Executive
                      </option>

                      <option value="superadmin">
                        Super Admin
                      </option>

                      <option value="manager">
                        Manager
                      </option>

                      <option value="sales">
                        Sales
                      </option>

                      <option value="accountant">
                        Accountant
                      </option>

                      <option value="marketing">
                        Marketing
                      </option>
                    </select>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    The selected role determines the staff member's
                    responsibilities and permissions.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={17} />

                {loading ? "Creating Staff..." : "Create Staff"}
              </button>
            </div>
          </div>

          {/* Bottom security note */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <p className="text-sm font-medium text-slate-700">
                Staff account security
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Make sure the staff member uses a secure password and
                only receives the permissions required for their role.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
