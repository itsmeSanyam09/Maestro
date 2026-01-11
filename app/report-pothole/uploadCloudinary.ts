"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadToCloudinary(file: File, maxRetries = 3) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = (await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                upload_preset: "my_preset",
                folder: "pothole_reports",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        })) as any;

        return {
          success: true,
          imageId: result.public_id,
          url: result.secure_url,
        };
      } catch (error: any) {
        lastError = error;
        console.warn(`Upload attempt ${attempt} failed. Retrying...`);

        if (attempt < maxRetries) await sleep(1000);
      }
    }
    throw lastError;
  } catch (error: any) {
    console.error("Cloudinary error after retries:", error);
    return {
      success: false,
      error: error.message || "Upload failed after multiple attempts",
    };
  }
}
