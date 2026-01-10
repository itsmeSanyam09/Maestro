"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/lib";
import { revalidatePath } from "next/cache";

// Helper for delay between retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createPotholeReport(
  formData: {
    address: string;
    lat: number | null;
    lng: number | null;
    description: string;
    severity: string;
    images: string[];
  },
  maxRetries = 3
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "You must be logged in to report a pothole.",
      };
    }

    let lastError;

    // Retry Loop
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const newPost = await prisma.post.create({
          data: {
            description: formData.description,
            address: formData.address,
            images: formData.images,
            userId: clerkId,
            longitude: formData?.lng,
            latitude: formData?.lat,
            severity: formData.severity,
          },
        });

        // If successful, revalidate and return immediately
        revalidatePath("/civilian");
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
