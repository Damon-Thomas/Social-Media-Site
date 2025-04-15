import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/app/lib/dal";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];
const homeRoute = "/";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await verifySession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (path === homeRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Ensure session is passed to the request headers for server-side rendering
  if (session) {
    req.headers.set("x-session", JSON.stringify(session));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
