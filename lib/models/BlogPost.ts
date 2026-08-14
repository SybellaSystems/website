import getClientPromise from "../mongodb";
import { BlogPost } from "@/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { json } from "zod";

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

//Create BlogPost
export async function createBlogPost(blogData: any) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs =  db.collection("blogposts");

  // Generate slug from title if not provided
  let slug = blogData.slug || generateSlug(blogData.title);

  // Ensure slug is unique by appending a number if needed
  let uniqueSlug = slug;
  let counter = 1;
  while (await blogs.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const res = await blogs.insertOne({
    ...blogData,
    slug: uniqueSlug,
    publishedAt: new Date(),
  });
  return res;
}

// Get all blog posts
export async function getAllBlogPosts(skip = 0, limit = 10) {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection<BlogPost>("blogposts");
  const blogs = await collection.find({}).skip(skip).limit(limit).toArray();
  const totalItems = await collection.countDocuments();
  return { blogs, totalItems };
}

//Get one blog post by slug
export async function getBlogPostBySlug(slug: string) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");
  return blogs.findOne({ slug });
}

// Update blog post
export async function updateBlogPost(slug: string, updateData: Partial<BlogPost>) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");
  const res = await blogs.findOneAndUpdate(
    { slug },
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return res;
}

//  Delete blog post by slug
export async function deleteBlogPost(slug: string) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");
  const res = await blogs.deleteOne({ slug });
  return res.deletedCount > 0;
}

// Delete blog post by _id
export async function deleteBlogPostById(id: string) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");
  const res = await blogs.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

// search or filter for blogposts
export async function searchBlogPosts(
  query: string,
  filters: { tags?: string[]; author?: string },
  page = 1,
  limit = 10
) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");
  const skip = (page - 1) * limit;
  const mongoQuery: any = {};
  if (query) {
    mongoQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { excerpt: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }
  if (filters?.author) {
    mongoQuery.author = filters.author;
  }
  if (filters?.tags && filters.tags.length > 0) {
    mongoQuery.tags = { $in: filters.tags };
  }
  const [data, total] = await Promise.all([
    blogs
      .find(mongoQuery)
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 })
      .toArray(),
    blogs.countDocuments(mongoQuery),
  ]);
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get minimal blog post data (slug + dates only) for sitemap generation.
// Uses a projection so we don't pull full article content/images into
// memory just to build the sitemap. Sorted newest-first, capped at 5000
// posts as a safety limit.
export async function getAllBlogPostsForSitemap(): Promise<
  Array<{ slug: string; publishedAt?: Date | string; updatedAt?: Date | string }>
> {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");
  const posts = await blogs
    .find({}, { projection: { slug: 1, publishedAt: 1, updatedAt: 1 } })
    .sort({ publishedAt: -1 })
    .limit(5000)
    .toArray();
  return posts as unknown as Array<
    { slug: string; publishedAt?: Date | string; updatedAt?: Date | string }
  >;
}