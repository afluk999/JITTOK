import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();
    const file = incomingFormData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No file was provided." },
        { status: 400 },
      );
    }

    const cloudName = (
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      ""
    ).trim();

    const uploadPreset = (
      process.env.CLOUDINARY_UPLOAD_PRESET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
      ""
    ).trim();

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        {
          error:
            "Cloudinary cloud name or upload preset is missing.",
        },
        { status: 500 },
      );
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
        cache: "no-store",
      },
    );

    const responseText = await cloudinaryResponse.text();

    let cloudinaryData: Record<string, any> = {};

    try {
      cloudinaryData = JSON.parse(responseText);
    } catch {
      cloudinaryData = { rawResponse: responseText };
    }

    if (!cloudinaryResponse.ok) {
      return NextResponse.json(
        {
          error:
            cloudinaryData?.error?.message ||
            cloudinaryData?.message ||
            cloudinaryData?.rawResponse ||
            "Cloudinary upload failed.",
        },
        { status: cloudinaryResponse.status },
      );
    }

    if (typeof cloudinaryData.secure_url !== "string") {
      return NextResponse.json(
        {
          error:
            "Cloudinary did not return a secure file URL.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      secure_url: cloudinaryData.secure_url,
      public_id: cloudinaryData.public_id,
      resource_type: cloudinaryData.resource_type,
      format: cloudinaryData.format,
    });
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "File upload failed.",
      },
      { status: 500 },
    );
  }
}