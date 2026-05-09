import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth.middleware";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req, { roles: ["executive", "superadmin"] });

    //If middleware returned a NextResponse, it means auth failed
    if (authResult instanceof NextResponse) return authResult;

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert file to base64 for serverless compatibility
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    // Determine MIME type
    const mimeType = file.type || 'image/jpeg';
    
    // Return base64 data URL (works in serverless environments)
    const imageUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        message: "Image uploaded successfully",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}


