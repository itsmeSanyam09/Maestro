"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/lib"; // Adjust this path to your client location
import { revalidatePath } from "next/cache";

export async function createPotholeReport(formData: {
  problem: string;
  address: string;
  images: string[];
}) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "You must be logged in to report a pothole.",
      };
    }

    // Create the post in Prisma
    const newPost = await prisma.post.create({
      data: {
        problem: formData.problem,
        address: formData.address,
        images: formData.images, // Array of strings (URLs)
        userId: clerkId, // Links to clerkUserId in your schema
        longitude: 0, // You can add geolocation logic later
        latitude: 0,
      },
    });

    // Refresh the dashboard data
    revalidatePath("/civilian");

    return { success: true, data: newPost };
  } catch (error) {
    console.error("Prisma Error:", error);
    return {
      success: false,
      error: "Failed to save the report to the database.",
    };
  }
}
