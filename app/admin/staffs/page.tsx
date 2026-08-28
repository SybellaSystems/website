"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import {
  Pencil,
  Trash2,
  Search,
  UserPlus,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  MoreHorizontal,
  X,
  Briefcase,
  User,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormValidator, ValidationErrors } from "@/lib/formValidation";

interface Staff {
  id: string;
  names: string;
  email: string;
  role: string;
  phone?: string;
  isActive?: boolean;
}

export default function AdminStaffPage() {
  const router = useRouter();

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const fetchStaffs = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaffs(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to fetch staff members"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStaffs();
    }
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (!editingStaff) return;

    setEditingStaff({
      ...editingStaff,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateEditForm = (): boolean => {
    if (!editingStaff) return false;

    const newErrors: ValidationErrors = {};

    const nameError = FormValidator.validateRequired(
      editingStaff.names,
      "Full Name"
    );

    if (nameError) {
      newErrors.names = nameError;
    }

    if (editingStaff.phone) {
      const phoneError = FormValidator.validatePhone(
        editingStaff.phone
      );

      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;

    if (!validateEditForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const toastId = toast.loading(
      "Updating staff member..."
    );

    try {
      const { id, email, ...updateData } = editingStaff;

      const res = await axios.patch(
        `/api/staff?id=${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status >= 200 && res.status < 300) {
        toast.success(
          "Staff updated successfully!",
          {
            id: toastId,
          }
        );

        closeModal();
        fetchStaffs();
      } else {
        toast.error(
          "Failed to update staff",
          {
            id: toastId,
          }
        );
      }
    } catch (err: any) {
      console.error(err);

      toast.error(
        "Failed to update staff",
        {
          id: toastId,
          description:
            err.response?.data?.message ||
            "Please try again",
        }
      );
    }
  };

  const handleDeleteStaff = async (id: string) => {
    toast.warning(
      "Are you sure you want to delete this staff member?",
      {
        action: {
          label: "Delete",
          onClick: async () => {
            const toastId = toast.loading(
              "Deleting staff member..."
            );

            try {
              const res = await axios.delete(
                `/api/staff/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (
                res.status >= 200 &&
                res.status < 300
              ) {
                toast.success(
                  "Staff deleted successfully!",
                  {
                    id: toastId,
                  }
                );

                fetchStaffs();
              } else {
                toast.error(
                  "Failed to delete staff",
                  {
                    id: toastId,
                  }
                );
              }
            } catch (err: any) {
              console.error(err);

              toast.error(
                "Failed to delete staff",
                {
                  id: toastId,
                  description:
                    err.response?.data?.message ||
                    "Please try again",
                }
              );
            }
          },
        },

        cancel: {
          label: "Cancel",
          onClick: () => toast.dismiss(),
        },
      }
    );
  };

  const openEditModal = (staff: Staff) => {
    setEditingStaff({
      ...staff,
    });

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingStaff(null);
    setShowModal(false);
    setErrors({});
  };

  const filteredStaffs = staffs.filter((staff) => {
    const query = searchQuery.toLowerCase();

    return (
      staff.names.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.role.toLowerCase().includes(query) ||
      staff.phone?.toLowerCase().includes(query)
    );
  });

  const activeStaff = staffs.filter(
    (staff) => staff.isActive !== false
  ).length;

  const rolesCount = new Set(
    staffs.map((staff) => staff.role)
  ).size;

  const formatRole = (role: string) => {
    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Users size={16} />
                <span>Staff Management</span>
                <span>•</span>
                <span>Team Members</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Staff Members
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your team members, roles and account
                access.
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/admin/staffs/add")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              <UserPlus size={18} />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ================= STATS ================= */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Staff
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {staffs.length}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Staff
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {activeStaff}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ShieldCheck size={22} />
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Roles
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {rolesCount}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Briefcase size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <p className="text-sm text-slate-500">
            {filteredStaffs.length} member
            {filteredStaffs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ================= STAFF TABLE ================= */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader
              size="lg"
              text="Loading staff members..."
            />
          </div>
        ) : filteredStaffs.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
              <Users size={32} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              {searchQuery
                ? "No staff found"
                : "No staff members yet"}
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {searchQuery
                ? "Try searching with another name, email or role."
                : "Add your first staff member to start managing your team."}
            </p>

            {!searchQuery && (
              <button
                onClick={() =>
                  router.push("/admin/staffs/add")
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <UserPlus size={18} />
                Add Staff
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Staff Member
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStaffs.map((staff) => (
                    <tr
                      key={staff.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Staff */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                            {staff.names
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {staff.names}
                            </p>

                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                              <Mail size={12} />
                              {staff.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                          <Briefcase size={12} />
                          {formatRole(staff.role)}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone
                            size={15}
                            className="text-slate-400"
                          />

                          {staff.phone || "Not provided"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            staff.isActive === false
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              staff.isActive === false
                                ? "bg-red-500"
                                : "bg-emerald-500"
                            }`}
                          />

                          {staff.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditModal(staff)
                            }
                            title="Edit staff member"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteStaff(staff.id)
                            }
                            title="Delete staff member"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredStaffs.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {staffs.length}
                </span>{" "}
                staff members
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ================= EDIT MODAL ================= */}
      {showModal && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Staff Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Edit Staff Member
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateStaff();
              }}
              className="p-6"
            >
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="names"
                      value={editingStaff.names}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                        errors.names
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                  </div>

                  {errors.names && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.names}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={editingStaff.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-500"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Email addresses cannot be changed here.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="phone"
                      value={editingStaff.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                        errors.phone
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Staff Role
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="role"
                      value={editingStaff.role}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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
                </div>
              </div>

              {/* Footer */}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
