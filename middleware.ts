import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session.server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];
const homeRoute = "/";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip authentication for POST requests to the root path
  if (path === "/" && req.method === "POST") {
    console.log("Skipping middleware for authentication action");
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  console.log("Middleware triggered for path:", path);

  // Lightweight session check without Prisma
  const cookie = req.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (cookie) {
    try {
      const session = await decrypt(cookie);
      isAuthenticated = !!session?.userId;
      console.log("Session found with userId:", session?.userId);
    } catch (e) {
      console.error("Invalid session:", e);
    }
  }

  console.log(
    "Session status:",
    isAuthenticated ? "Authenticated" : "Unauthenticated"
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (path === homeRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Pass authentication status to the request headers
  if (isAuthenticated) {
    req.headers.set("x-auth-status", "authenticated");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
