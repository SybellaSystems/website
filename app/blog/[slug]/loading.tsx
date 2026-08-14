import Loader from "@/components/Loader";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center py-24">
      <Loader size="lg" text="Loading article..." />
    </div>
  );
}