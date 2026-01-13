'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useI18n } from '../../contexts/I18nContext'
import { logger } from '../../lib/logger'

interface BlogPost {
  title: string
  excerpt: string
  content: string
  author: string
  tags: string[]
  slug: string
  readTime: number
  thumbnailUrl: string
  publishedAt: string
}

export default function BlogPage() {
  const { t } = useI18n()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [activePost, setActivePost] = useState<BlogPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 6 

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/blogposts/?limit=${limit}&page=${page}`)
        const blogs = Array.isArray(res.data.data) ? res.data.data : []
        setBlogPosts(blogs)
        setTotalPages(res.data.totalPages || 1)
        logger.info('Blog page loaded', { page, postsCount: blogs.length })
      } catch (err: any) {
        console.error(err)
        setError('Failed to fetch blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [page])

  // Open modal (single blog)
  const openModal = async (slug: string) => {
    try {
      const res = await axios.get(`/api/blogposts/${slug}/`)
      setActivePost(res.data)
      setModalOpen(true)
    } catch (err: any) {
      console.error(err)
      alert('Failed to load blog details')
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setActivePost(null)
  }

  // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface shadow-sm">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-dark-blue dark:text-white mb-4">{t('blog.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-8">
          {loading ? (
            <p>Loading blogs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : blogPosts.length === 0 ? (
            <p>No blogs found</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white dark:bg-dark-surface rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <div className="h-48 w-full overflow-hidden rounded-t-xl">
                      <img
                        src={post.thumbnailUrl || '/images/blog/default.jpg'}
                        alt={post.title}
                        className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-gray-400 mb-2">
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                          <span>•</span>
                          <span>By {post.author}</span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-semibold text-dark-blue dark:text-white mb-2 hover:text-accent transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between flex-wrap mt-2">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-accent hover:text-white cursor-pointer transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => openModal(post.slug)}
                          className="text-accent text-sm font-semibold hover:text-green-600 transition-colors"
                        >
                          {t('blog.readMore')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg text-white ${
                    page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-green-600'
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg text-white ${
                    page === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-green-600'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          {/* Popular Posts */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-dark-blue dark:text-white mb-4">{t('blog.popularPosts.title')}</h3>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <div
                  key={post.slug}
                  className="flex space-x-3 items-center hover:bg-gray-50 dark:hover:bg-dark-surface p-2 rounded-lg cursor-pointer transition-colors"
                  onClick={() => openModal(post.slug)}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">📝</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-dark-blue dark:text-white hover:text-accent transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-dark-blue dark:text-white mb-4">{t('blog.tags.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {['Digital Transformation', 'AI', 'Healthcare', 'Education', 'E-commerce', 'Africa', 'Innovation', 'Technology'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-accent hover:text-white cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
{modalOpen && activePost && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-dark-surface rounded-xl w-11/12 max-w-3xl max-h-[50vh] flex flex-col relative shadow-xl">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-300 text-lg font-bold hover:text-red-500 bg-white dark:bg-dark-surface rounded-full w-8 h-8 flex items-center justify-center shadow-md"
      >
        &times;
      </button>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1">
        <div className="p-6">
          <img
            src={activePost.thumbnailUrl || '/images/blog/default.jpg'}
            alt={activePost.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          
          <h2 className="text-2xl font-bold text-dark-blue dark:text-white mb-2">
            {activePost.title}
          </h2>
          
          <div className="flex items-center space-x-3 text-sm text-gray-400 dark:text-gray-400 mb-4">
            <span>{new Date(activePost.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{activePost.readTime} min read</span>
            <span>•</span>
            <span>By {activePost.author}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {activePost.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {activePost.content}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
