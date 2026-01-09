"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/lib"; // Adjust path to your prisma client

export async function getUserPosts() {
  try {
    // 1. Get the authenticated user's ID on the server
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // 2. Fetch posts belonging to this clerkUserId
    const posts = await prisma.post.findMany({
      where: {
        userId: clerkId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("posts", posts);

    return { success: true, data: posts };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { success: false, error: "Could not retrieve posts." };
  }
}
