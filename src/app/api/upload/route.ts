import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No images uploaded" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const base64Image = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "jittok/products",
        resource_type: "image",
      });

      uploadedImages.push(result.secure_url);
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}