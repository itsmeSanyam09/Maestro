"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/lib";

async function withRetry(fn: any, retries = 3, delay = 500) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;

    console.warn(
      `Prisma fetch failed. Retrying in ${delay}ms... (${
        retries - 1
      } attempts left)`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(fn, retries - 1, delay * 2);
  }
}

export async function getUserPosts() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Wrap the Prisma call in the retry logic
    const posts = await withRetry(async () => {
      return await prisma.post.findMany({
        where: {
          userId: clerkId,
        },
        include: {
          aiDimensions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    console.log("posts", posts);

    // Prisma findMany returns an empty array [] if no records found, not undefined
    return { success: true, data: posts || [] };
  } catch (error) {
    console.error("Failed to fetch posts after retries:", error);
    return { success: false, data: [], error: "Database connection failed" };
  }
}
