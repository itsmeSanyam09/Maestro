"use server";

import { prisma } from "../lib/lib";
import { revalidatePath } from "next/cache";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    console.warn(
      `Database operation failed. Retrying in ${delay}ms... (${
        retries - 1
      } left)`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// --- Actions ---

export async function fetchAllComplaints() {
  try {
    const posts = await withRetry(async () => {
      return await prisma.post.findMany({
        include: {
          user: true,
          aiDimensions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    return posts.map((post) => ({
      id: post.id,
      reporterName: post.user?.name || "Anonymous",
      image:
        post.images[0] ||
        "https://images.unsplash.com/photo-1625228446534-d54ff2b1f6ab?w=400&h=300&fit=crop",
      location: post.address,
      longitude: post.longitude,
      latitude: post.latitude,
      status: post.status || "pending",
      dateReported: post.createdAt.toISOString().split("T")[0],
      severity: post.severity && post.severity.length > 0 
        ? post.severity.charAt(0).toUpperCase() + post.severity.slice(1).toLowerCase()
        : "Medium",
      description: post.description || "No description provided",
      aiDimensions: post.aiDimensions,
    }));
  } catch (error) {
    console.error("Database Error after retries:", error);
    return [];
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  newStatus: string
) {
  try {
    await withRetry(async () => {
      return await prisma.post.update({
        where: { id: complaintId },
        data: { status: newStatus },
      });
    });

    revalidatePath("/admin-dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status after retries:", error);
    return { success: false, error: "Database update failed" };
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await withRetry(async () => {
      const result = await prisma.post.findUnique({
        where: { id: postId },
        include: { 
          user: true,
          aiDimensions: true,
        },
      });
      if (!result) throw new Error("Post not found");
      return result;
    });

    // Randomization logic remains the same
    const response: any = {
      id: post.id,
      images: post.images || [],
      severity: post.severity,
      status: post.status,
      location: {
        address: post.address,
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        coordinates: {
          latitude: post.latitude,
          longitude: post.longitude,
        },
      },
      dateReported: post.createdAt,
      description: post.description,
      dimensions: {
        length: Number(post.dimension[0]) / 8,
        width: Number(post.dimension[1]) / 5,
        depth: (Math.floor(Math.random() * 10) + 1) / 10,
      },
      estimatedCost:
        3000 +
        Number(post.dimension[0]) *
          Number(post.dimension[1]) *
          ((Math.floor(Math.random() * 10) + 1) / 10) *
          108,
      assignedTeam: "Municipal Works Department - Zone 3",
      estimatedCompletionDate: "2025-01-10",
      damageType: "Road Surface Damage",
      trafficImpact: "High",
      weatherCondition: "Post-Monsoon",
      nearbyLandmarks: [
        delhiLandmarks[Math.floor(Math.random() * 17)],
        delhiLandmarks[Math.floor(Math.random() * 17)],
      ],
      reporterNotes: `This pothole has caused ${
        Math.floor(Math.random() * 4) + 1
      } accidents in the past week. Urgent repair needed.`,
    };

    // Add AI dimensions if available
    if (post.aiDimensions) {
      response.aiDimensions = post.aiDimensions;
    }

    return response;
  } catch (error) {
    console.error("Error fetching post after retries:", error);
    throw new Error("Failed to fetch post");
  }
}

const delhiLandmarks = [
  "Rajiv Chowk Metro Station",
  "Kashmere Gate Metro Station",
  "AIIMS Metro Station",
  "SBI Connaught Place Branch",
  "SBI Saket Branch",
  "Pacific Mall Tagore Garden",
  "Select Citywalk Mall",
  "DLF Mall of India",
  "India Gate",
  "Red Fort",
  "Lotus Temple",
  "Akshardham Temple",
  "Safdarjung Hospital",
  "AIIMS Delhi Hospital",
  "Indira Gandhi International Airport",
  "ISBT Kashmere Gate",
  "Delhi University North Campus",
];
