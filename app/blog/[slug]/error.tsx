"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog post page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card rounded-2xl p-10 sm:p-14 text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-secondary mb-6">
          We couldn&apos;t load this article. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/blog" className="btn-ghost">
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}