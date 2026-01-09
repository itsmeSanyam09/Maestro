import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = ["/", "/login", "/register"];

export default clerkMiddleware(async (auth, req) => {
  // Retrieve session claims
  const { sessionClaims, userId, isAuthenticated } = await auth();
  if (!userId && !isPublicRoute.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/register", req.url));
  }
  if (userId) {
    const role = (sessionClaims?.metadata?.role ||
      (await clerkClient()).users.getUser(userId)) as string | undefined;
    if (role === "admin" && req.nextUrl.pathname === "/civilian") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // prevent non-admin user to access the admin routes
    if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/civilian", req.url));
    }
    //redirect auth user tryng to access public routes
    if (isPublicRoute.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/civilian", req.url)
      );
    }
  }
  console.log(`${isAuthenticated} ${userId} ${sessionClaims?.metadata.role}`);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
