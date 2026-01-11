"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/lib";
import { revalidatePath } from "next/cache";

// Helper for delay between retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

/**
 * MOCK AI MODEL ACTION
 * Replace the fetch logic with your actual Image Model API (e.g., Gemini, Flask, etc.)
 */
export async function processPotholeAI(formData: FormData) {
  try {
    const res = await fetch(
      "https://shourya23-yoloroadcracksapi.hf.space/model",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error(`AI Model responded with ${res.status}`);

    // 1. Get the response as binary data
    const arrayBuffer = await res.arrayBuffer();

    // 2. Convert to Base64 so it can be sent to the client
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    return {
      success: true,
      processedImage: base64Image, // This is now a string like "iVBORw0KG..."
      mimeType: "image/png",
    };
  } catch (error) {
    console.error("AI Processing Error:", error);
    return { success: false, error: "Failed to process image with AI" };
  }
}
export async function createPotholeReport(
  formData: {
    address: string;
    lat: number | null;
    lng: number | null;
    description: string;
    severity: string;
    images: string[];
    aiDimensions?: {
      length_cm: string;
      width_cm: string;
      depth_cm: string;
      severity: string;
      reasoning?: string;
    };
  },
  maxRetries = 3
) {
  try {
    // Get userId if user is logged in, otherwise use null for anonymous submission
    let clerkId: string | null = null;
    try {
      const session = await auth();
      clerkId = session?.userId || null;
    } catch (e) {
      // User not logged in - this is okay, allow anonymous submission
      clerkId = null;
    }
    
    console.log("Creating report for user:", clerkId || "anonymous");
    console.log("Form data:", formData);

    let lastError;

    // Retry Loop
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const postData: any = {
          description: formData.description,
          address: formData.address,
          images: formData.images,
          longitude: formData?.lng,
          latitude: formData?.lat,
          severity: formData.severity,
          dimension: ["0", "0"], // Default dimensions
        };

        // Add userId only if user is logged in
        if (clerkId) {
          postData.userId = clerkId;
        }

        // Add AI dimensions only if provided
        if (formData.aiDimensions) {
          postData.aiDimensions = {
            create: {
              length_cm: formData.aiDimensions.length_cm,
              width_cm: formData.aiDimensions.width_cm,
              depth_cm: formData.aiDimensions.depth_cm,
              severity: formData.aiDimensions.severity,
              reasoning: formData.aiDimensions.reasoning || null,
            },
          };
        }

        const newPost = await prisma.post.create({
          data: postData,
          include: formData.aiDimensions ? {
            aiDimensions: true,
          } : undefined,
        });

        console.log("Post created successfully:", newPost);

        // If successful, revalidate and return immediately
        revalidatePath("/civilian");
        revalidatePath("/admin");
        return { success: true, data: newPost };
      } catch (error) {
        lastError = error;
        console.warn(`Database attempt ${attempt} failed. Retrying in 1s...`);

        // Wait 1 second before next attempt
        if (attempt < maxRetries) await sleep(1000);
      }
    }

    // If we reach here, all retries failed
    throw lastError;
  } catch (error: any) {
    console.error("Final Prisma Error after retries:", error);
    return {
      success: false,
      error: "Failed to save the report after multiple attempts.",
    };
  }
}
