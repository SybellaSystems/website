import { NextRequest, NextResponse } from 'next/server'
import { deleteBlogPost, updateBlogPost, getBlogPostBySlug } from "@/lib/models/BlogPost";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { error } from 'console';

export async function DELETE(req: NextRequest, {params}:{params: {slug: string}}) {
   const user = await authMiddleware(req, { roles: ["superadmin", "executive", "cto"] });
   if (user instanceof NextResponse ) return user;

   try {

    const blogpost = await deleteBlogPost(params.slug);
    if(!blogpost) return NextResponse.json({error: "Not Found"}, {status: 404})
    return NextResponse.json({message: "Slug Deleted"})

   } catch(err: any) {
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
        const updatedBlog = await updateBlogPost(params.slug, parsed)
        if(!updatedBlog) return;
        return NextResponse.json({message: "Blog Updated"})
    } catch(err: any) {
        return NextResponse.json({error: err.message}, {status: 500})
    }
}


