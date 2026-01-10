// app/report-pothole/uploadCloudinary.ts
"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Change the type from 'string' to 'any' or 'File' to handle the incoming object
export async function uploadToCloudinary(file: any) {
  try {
    // 1. Convert the File object into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload using the buffer via a promise wrapper
    const result = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "my_preset", // Using the preset from your screenshot
            folder: "pothole_reports",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    })) as any;

    // 3. Return the public_id so you can retrieve it later
    return {
      success: true,
      imageId: result.public_id, // Store this in your DB
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Cloudinary error:", error);
    return { success: false, error: error.message || "Upload failed" };
  }
}
