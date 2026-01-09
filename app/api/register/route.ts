// app/api/register/route.ts
import { prisma } from "@/app/lib/lib";
import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";

export async function POST(request: Request) {
  const maxAttempts = 3;

  // 1. Validate Input
  let data;
  try {
    data = await request.json();
    if (!data.clerkId || !data.email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // 2. Retry Loop
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const user = await prisma.user.create({
        data: {
          clerkUserId: data.clerkId,
          name: data.name,
          phNumber: data.phoneNumber,
          email: data.email,
        },
      });

      // Success - Return immediately
      return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error: any) {
      // 3. Handle Specific Prisma Errors (Don't retry these)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return NextResponse.json(
            { success: false, error: "Email or Phone already exists." },
            { status: 409 } // 409 Conflict
          );
        }
      }

      // 4. Handle Retryable Errors (Connection/Timeout)
      if (attempt < maxAttempts) {
        const delay = attempt * 2000; // 2s, 4s
        console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Final failure after all retries
        console.error("Database connection error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Database is unavailable. Please try again later.",
          },
          { status: 503 } // 503 Service Unavailable
        );
      }
    }
  }
}
