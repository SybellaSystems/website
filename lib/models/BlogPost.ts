import getClientPromise from "../mongodb";
import { BlogPost } from "@/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { json } from "zod";

//Create BlogPost
export async function createBlogPost(blogData: BlogPost) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs =  db.collection<BlogPost>("blogposts");
  const existingSlug = await db.collection("blogposts").findOne({slug: blogData.slug});
  if (existingSlug) {
    throw new Error ("Blog already Exists")
  }
  const res = await blogs.insertOne({
    ...blogData,
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

//  Delete blog post 
export async function deleteBlogPost(slug: string) {
  const client = await getClientPromise();
  const db = client.db();
  const blogs = db.collection<BlogPost>("blogposts");

  const res = await blogs.deleteOne({ slug });
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