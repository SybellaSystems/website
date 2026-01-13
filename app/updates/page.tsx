'use client';

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Calendar, Tag } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isFetchingRef = useRef(false);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  //Fetch updates by page
  const fetchUpdates = async (pageNumber = 1) => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await axios.get(
        `api/updates?page=${pageNumber}&limit=6`
      );

      const data = Array.isArray(res.data) ? res.data : [];

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setUpdates((prev) => {
          const existingIds = new Set(prev.map(u => u.id));
          const newUpdates = data.filter((u: Update) => !existingIds.has(u.id));
          return [...prev, ...newUpdates];
        });
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loadingMore &&
        !isFetchingRef.current &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (page > 1) fetchUpdates(page);
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="text-center py-16 text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-16 text-gray-700 dark:text-gray-200">
        No updates available
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12">
      {/* Page Heading */}
      <div className="max-w-7xl mx-auto text-center mb-10 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-indigo-700 dark:text-yellow-400">
          Latest Updates
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
          Stay informed with our latest news and announcements
        </p>
      </div>

      {/* Updates Grid */}
      <div className="w-full px-4 sm:px-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {updates.map((update, index) => (
          <div
            key={update.id}
            className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
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
              <h3 className="text-lg font-semibold mb-1 text-indigo-700 dark:text-yellow-400 line-clamp-2">
                {update.title}
              </h3>

              {/* Metadata */}
              <div className="flex items-center gap-3 mb-2 text-xs text-gray-500 dark:text-gray-400">
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
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                {update.description}
              </p>

              {/* Expandable Details */}
              {expandedIndex === index && (
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-2 transition-all duration-300">
                  Details by {update.author}
                </p>
              )}

              {/* Read More Button */}
              <button
                onClick={() => toggleExpand(index)}
                className="self-start mt-auto bg-indigo-600 dark:bg-yellow-400 text-white dark:text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-indigo-700 dark:hover:bg-yellow-500 transition-colors duration-300"
              >
                {expandedIndex === index ? "Show Less" : "Read More"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lazy Loading Spinner */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
}