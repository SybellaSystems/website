import { MetadataRoute } from "next";
import { getAllBlogPostsForSitemap } from "@/lib/models/BlogPost";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sybellasystems.co.rw";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ecosystem`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ogera`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  // Dynamically include every blog post from MongoDB so new articles show
  // up in the sitemap automatically, with no manual/hard-coded URLs.
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllBlogPostsForSitemap();
    blogRoutes = posts
      .filter((post) => !!post.slug)
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : post.publishedAt
            ? new Date(post.publishedAt)
            : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch (err) {
    // Never let a DB hiccup break the whole sitemap — fall back to static
    // routes only, and log for visibility.
    console.error("Failed to load blog posts for sitemap:", err);
  }

  return [...staticRoutes, ...blogRoutes];
}