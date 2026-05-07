'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Calendar, Tag } from "lucide-react";
import Loader from "@/components/Loader";

const LIMIT = 6;

interface Update {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  thumbnail?: string;
  createdAt: string;
  isActive?: boolean;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isFetchingRef = useRef(false);
  const pageRef = useRef(1);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  //Fetch updates by page
  const fetchUpdates = useCallback(async (pageNumber = 1) => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await axios.get(
        `/api/updates?page=${pageNumber}&limit=${LIMIT}`
      );

      const data = Array.isArray(res.data) ? res.data : [];

      if (pageNumber === 1) {
        setUpdates(data);
        setHasMore(data.length >= LIMIT);
      } else if (data.length === 0) {
        setHasMore(false);
      } else {
        setUpdates((prev) => {
          const existingIds = new Set(prev.map(u => u.id));
          const newUpdates = data.filter((u: Update) => !existingIds.has(u.id));

          // Stop infinite fetch loops when API returns duplicates or short pages.
          if (newUpdates.length === 0 || data.length < LIMIT) {
            setHasMore(false);
          }

          return [...prev, ...newUpdates];
        });
      }

      if (data.length > 0) {
        pageRef.current = pageNumber;
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !isFetchingRef.current &&
        hasMore
      ) {
        fetchUpdates(pageRef.current + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchUpdates, hasMore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center py-16 text-secondary">
        Loading...
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center py-16 text-secondary">
        No updates available
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden border-t border-dim py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: "url('/globe.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />

      {/* Page Heading */}
      <div className="max-w-7xl mx-auto text-center mb-10 mt-8 relative">
        <div className="tag mx-auto mb-5 w-fit">Updates</div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Latest Updates
        </h1>
        <p className="text-base md:text-lg text-secondary">
          Stay informed with our latest news and announcements
        </p>
      </div>

      {/* Updates Grid */}
      <div className="max-w-7xl mx-auto relative grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {updates.map((update, index) => (
          <div
            key={update.id}
            className="card flex flex-col overflow-hidden"
          >
            {/* Image */}
            <div className="w-full h-40 overflow-hidden">
              <img
                src={update.thumbnail || "/default-thumbnail.jpg"}
                alt={update.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              {/* Header */}
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {update.title}
              </h3>

              {/* Metadata */}
              <div className="flex items-center gap-3 mb-2 text-xs text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(update.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> <span>{update.category}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-secondary mb-2 line-clamp-3">
                {update.description}
              </p>

              {/* Expandable Details */}
              {expandedIndex === index && (
                <p className="text-sm text-secondary mb-2 transition-all duration-300">
                  Details by {update.author}
                </p>
              )}

              {/* Read More Button */}
              <button
                onClick={() => toggleExpand(index)}
                className="btn-primary self-start mt-auto"
              >
                {expandedIndex === index ? "Show Less" : "Read More"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lazy Loading Spinner */}
      {loadingMore && (
        <div className="flex justify-center py-8 relative">
          <Loader size="md" text="Loading more updates..." />
        </div>
      )}
    </section>
  );
}