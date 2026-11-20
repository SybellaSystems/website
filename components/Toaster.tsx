"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors={false}
      closeButton
      duration={3000}
      toastOptions={{
        style: {
          background: "var(--surface)",
          border: "1px solid var(--border-bright)",
          color: "var(--text-primary)",
          borderRadius: "4px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
          fontFamily: "var(--font-body-stack)",
          fontSize: "14px",
        },
        classNames: {
          success: "sybella-toast-success",
          error: "sybella-toast-error",
        },
      }}
    />
  );
}
