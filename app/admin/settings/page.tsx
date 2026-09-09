"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/Loader";

interface StaffUser {
  id: string;
  names: string;
  email: string;
  phone?: string;
  role: string;
  permissions?: string[];
}

interface ProfileForm {
  names: string;
  email: string;
  phone: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [form, setForm] = useState<ProfileForm>({
    names: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string[]>([]);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const fetchUser = async () => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    setLoading(true);
    setFetchError("");

    try {
      const res = await axios.get("/api/staff/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedUser: StaffUser = res.data?.user ?? res.data;

      setUser(fetchedUser);

      setForm({
        names: fetchedUser.names || "",
        email: fetchedUser.email || "",
        phone: fetchedUser.phone || "",
      });
    } catch (err: any) {
      console.error("Failed to fetch user:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/signin";
        return;
      }

      setFetchError(
        err.response?.data?.error ||
          "Unable to load your account settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const passwordRequirements = useMemo(
    () => [
      {
        label: "At least 8 characters",
        valid: passwordForm.newPassword.length >= 8,
      },
      {
        label: "One uppercase letter",
        valid: /[A-Z]/.test(passwordForm.newPassword),
      },
      {
        label: "One special character",
        valid: /[\W_]/.test(passwordForm.newPassword),
      },
    ],
    [passwordForm.newPassword]
  );

  const passwordIsValid = passwordRequirements.every(
    (requirement) => requirement.valid
  );

  const profileIsValid =
    form.names.trim().length > 0 &&
    form.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleProfileUpdate = async () => {
    if (!user || savingProfile) return;

    setProfileSaved(false);

    if (!form.names.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSavingProfile(true);

    const toastId = toast.loading("Updating profile...");

    try {
      const res = await axios.patch(
        `/api/staff/self/${user.id}`,
        {
          names: form.names.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser: StaffUser = res.data?.user ?? res.data;

      setUser(updatedUser);

      setForm({
        names: updatedUser.names || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      setProfileSaved(true);

      toast.success("Profile updated successfully!", {
        id: toastId,
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update profile.";

      toast.error("Profile update failed", {
        id: toastId,
        description: errorMsg,
      });

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/signin";
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user || savingPassword) return;

    setPasswordError([]);

    const frontendErrors: string[] = [];

    if (!passwordForm.oldPassword) {
      frontendErrors.push("Current password is required.");
    }

    if (!passwordForm.newPassword) {
      frontendErrors.push("New password is required.");
    }

    if (passwordForm.newPassword.length < 8) {
      frontendErrors.push("New password must contain at least 8 characters.");
    }

    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      frontendErrors.push("New password must contain an uppercase letter.");
    }

    if (!/[\W_]/.test(passwordForm.newPassword)) {
      frontendErrors.push("New password must contain a special character.");
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      frontendErrors.push(
        "New password must be different from your current password."
      );
    }

    if (frontendErrors.length > 0) {
      setPasswordError(frontendErrors);
      return;
    }

    setSavingPassword(true);

    const toastId = toast.loading("Updating password...");

    try {
      const res = await axios.patch(
        `/api/staff/self/password/${user.id}`,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      toast.success("Password updated successfully!", {
        id: toastId,
        description:
          res.data?.message || "Your password has been changed.",
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });

      setPasswordError([]);

      setShowCurrentPassword(false);
      setShowNewPassword(false);
    } catch (err: any) {
      console.error("Password update failed:", err);

      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const messages = err.response.data.errors.map(
          (error: any) => error.message
        );

        setPasswordError(messages);

        toast.error("Password update failed", {
          id: toastId,
          description: messages[0],
        });
      } else if (err.response?.data?.error) {
        const errorMessage = err.response.data.error;

        setPasswordError([errorMessage]);

        toast.error("Password update failed", {
          id: toastId,
          description: errorMessage,
        });
      } else {
        setPasswordError(["Failed to update password."]);

        toast.error("Password update failed", {
          id: toastId,
        });
      }

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/signin";
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading settings..." />
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Unable to load settings
              </h2>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {fetchError || "We couldn't load your account information."}
              </p>

              <button
                onClick={fetchUser}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    user.names
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your profile information and account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-surface">
          {/* Profile Header */}
          <div className="border-b border-gray-200 bg-gray-50/70 px-6 py-6 dark:border-gray-700 dark:bg-slate-900/40">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-sm">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.names}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user.role}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Section title */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <UserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Update the information associated with your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="names"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="names"
                    type="text"
                    autoComplete="name"
                    value={form.names}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        names: e.target.value,
                      });
                      setProfileSaved(false);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        email: e.target.value,
                      });
                      setProfileSaved(false);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone number
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        phone: e.target.value,
                      });
                      setProfileSaved(false);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-slate-900/40">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Account permissions
                  </h4>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Permissions assigned to your staff account.
                  </p>

                  {user.permissions && user.permissions.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.permissions.map((permission, index) => (
                        <span
                          key={`${permission}-${index}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300"
                        >
                          <Check className="h-3 w-3 text-green-500" />
                          {permission}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      No permissions assigned.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {profileSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Changes saved
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleProfileUpdate}
                disabled={!profileIsValid || savingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
              >
                {savingProfile ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Security Card */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-surface">
          <div className="border-b border-gray-200 bg-gray-50/70 px-6 py-6 dark:border-gray-700 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20">
                <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Security
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-2xl">
              {/* Current password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current password
                </label>

                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => {
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      });
                      setPasswordError([]);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
                    placeholder="Enter your current password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="mt-5">
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      });
                      setPasswordError([]);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
                    placeholder="Create a new password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-900/50">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Password requirements
                </p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {passwordRequirements.map((requirement) => (
                    <div
                      key={requirement.label}
                      className={`flex items-center gap-2 text-xs ${
                        requirement.valid
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          requirement.valid
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {requirement.valid && (
                          <Check className="h-2.5 w-2.5" />
                        )}
                      </span>

                      {requirement.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend errors */}
              {passwordError.length > 0 && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />

                    <div className="space-y-1">
                      {passwordError.map((error, index) => (
                        <p
                          key={index}
                          className="text-sm text-red-700 dark:text-red-300"
                        >
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Password button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={
                    savingPassword ||
                    !passwordForm.oldPassword ||
                    !passwordForm.newPassword ||
                    !passwordIsValid
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
                >
                  {savingPassword ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Update password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}