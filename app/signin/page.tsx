import { LoginForm } from "@/components/admin/auth/LoginForm";
import { LoginShowcase } from "@/components/admin/auth/LoginShowcase";
import { getServerAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const session = getServerAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_auto]">
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <LoginForm />
      </div>
      <LoginShowcase />
    </main>
  );
}
