import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card rounded-2xl p-10 sm:p-14 text-center max-w-md">
        <div className="text-4xl mb-4">📄</div>
        <h1 className="text-2xl font-bold mb-2">Article not found</h1>
        <p className="text-secondary mb-6">
          The article you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </p>
        <Link href="/blog" className="btn-primary">
          Back to Blog
        </Link>
      </div>
    </div>
  );
}