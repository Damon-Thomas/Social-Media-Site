import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session.server";
import cache from "@/app/lib/cache";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];
// const homeRoute = "/";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip authentication for POST requests to root path
  if (path === "/" && req.method === "POST") {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Read cookie from request
  const cookie = req.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (cookie) {
    if (cache.has(cookie)) {
      const session = cache.get(cookie);
      isAuthenticated = !!session?.userId;
    } else {
      try {
        const session = await decrypt(cookie);
        isAuthenticated = !!session?.userId;
        // Cache the session for 5 minutes (300 seconds)
        cache.set(cookie, session, 300);
        const validateUser = await fetch(
          `${req.nextUrl.origin}/api/auth/validCookie`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: `session=${cookie}`,
            },
          }
        );
        if (validateUser.status === 401) {
          // Clear invalid session cookie and redirect to home
          const clearRes = NextResponse.redirect(new URL("/", req.nextUrl));
          clearRes.cookies.set({
            name: "session",
            value: "",
            expires: new Date(0),
            path: "/",
          });
          return clearRes;
        }
      } catch (e) {
        // Clear invalid cookies
        const response = NextResponse.next();
        response.cookies.set({
          name: "session",
          value: "",
          expires: new Date(0),
          path: "/",
        });
        return response;
      }
    }
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
