import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure sign in for the Sybella admin workspace.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
