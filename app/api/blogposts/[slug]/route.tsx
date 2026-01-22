import { NextRequest, NextResponse } from 'next/server'
import { deleteBlogPost, deleteBlogPostById, updateBlogPost, getBlogPostBySlug } from "@/lib/models/BlogPost";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { error } from 'console';
import getClientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest, {params}:{params: {slug: string}}) {
   const user = await authMiddleware(req, { roles: ["superadmin", "executive", "cto"] });
   if (user instanceof NextResponse ) return user;

   try {
    // Check if params.slug is an ObjectId (24 hex characters) or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.slug);
    
    let deletedBlog;
    if (isObjectId) {
        // Delete directly by _id
        deletedBlog = await deleteBlogPostById(params.slug);
    } else {
        // It's a slug, use it directly
        deletedBlog = await deleteBlogPost(params.slug);
    }
    
    if(!deletedBlog) {
        return NextResponse.json({error: "Blog not found"}, {status: 404});
    }
    return NextResponse.json({message: "Blog deleted successfully"});

   } catch(err: any) {
    console.error("Delete blog error:", err);
    return NextResponse.json({error: err.message}, {status: 500})
   }

}


export async function GET(req: NextRequest, {params}:{params: {slug: string}}) {
    try {
        const blogpost = await getBlogPostBySlug(params.slug);
        if(!blogpost) return NextResponse.json({error: "Not Found"}, {status: 404})
        return NextResponse.json(blogpost)
    } catch(err: any) {
        return NextResponse.json({error: err.message}, {status: 500})
    }
}


export async function PATCH(req: NextRequest, {params}:{params: {slug: string}}) {
    const user = await authMiddleware(req, { roles: ["superadmin", "executive", "cto"] });
    if (user instanceof NextResponse ) return user;

    const data = await req.json()
    try {
        const parsed = JSON.parse(JSON.stringify(data));
        
        // Check if params.slug is an ObjectId (24 hex characters) or a slug
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.slug);
        
        let updatedBlog;
        if (isObjectId) {
            // If it's an ObjectId, find by _id first to get the slug
            const client = await getClientPromise();
            const db = client.db();
            const blog = await db.collection("blogposts").findOne({ _id: new ObjectId(params.slug) });
            if (!blog) {
                return NextResponse.json({error: "Blog not found"}, {status: 404});
            }
            // Use the blog's slug for update
            updatedBlog = await updateBlogPost(blog.slug, parsed);
        } else {
            // It's a slug, use it directly
            updatedBlog = await updateBlogPost(params.slug, parsed);
        }
        
        if(!updatedBlog) {
            return NextResponse.json({error: "Blog not found"}, {status: 404});
        }
        return NextResponse.json({message: "Blog Updated", blog: updatedBlog})
    } catch(err: any) {
        console.error("Update blog error:", err);
        return NextResponse.json({error: err.message}, {status: 500})
    }
}


