"use server";
import { Roles } from "../types/global";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};

export async function setUserRole(userId: string, email: string) {
  const client = await clerkClient();

  // Logic: Check the email to assign the role
  try {
    const role = email.trim().toLowerCase().endsWith("5@gmail.com")
      ? "admin"
      : "member";
    await new Promise((res) => setTimeout(res, 5000));
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });
    console.log("success");
    return { success: true, role };
  } catch (error: any) {
    console.log(error.errors);
  }
}
