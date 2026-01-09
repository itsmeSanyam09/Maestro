"use server";
import { prisma } from "../lib/lib";
export async function handleRegistration(data: {
  clerkId: string | null;
  email: string;
  name: string;
  phoneNumber: string;
}) {
  console.log(data);
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const user = await prisma.user.create({
        data: {
          clerkUserId: data.clerkId || "",
          name: data.name,
          phNumber: data.phoneNumber,
          email: data.email,
        },
      });

      // Success - return a plain serializable object (no NextResponse)
      return { success: true, user };
    } catch (err: any) {
      console.log(err);
      if (attempt === maxAttempts) {
        return { success: false, error: err?.message ?? String(err) };
      }
      // small backoff before retry
      await new Promise((res) => setTimeout(res, 200 * attempt));
    }
  }
}
