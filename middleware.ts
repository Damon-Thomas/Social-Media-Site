import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session.server";
import cache from "@/app/lib/cache";

// Change this to use prefixes instead of exact matches
const protectedPrefixes = ["/dashboard"];
const publicRoutes = ["/", "/auth", "/api/auth"];
const apiExemptRoutes = ["/api/me", "/api/fullUser"];

type Session = {
  userId: string;
  expiresAt: string;
  iat: number;
  exp: number;
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip authentication for POST requests to root path
  if (path === "/" && req.method === "POST") {
    return NextResponse.next();
  }

  // Skip authentication for exempt API routes
  if (apiExemptRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if this is a protected path (starts with any protected prefix)
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  const isPublicRoute = publicRoutes.some((route) => route === path);

  // Read cookie from request - keep your existing cache logic
  const cookie = req.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (cookie) {
    if (cache.has(cookie)) {
      const session = cache.get(cookie) as Session;
      isAuthenticated = !!session.userId;
    } else {
      // Your existing decrypt and validation logic stays the same
      try {
        const session = await decrypt(cookie);
        isAuthenticated = !!session?.userId;

        if (session?.userId) {
          // Cache the session for 5 minutes
          cache.set(cookie, session, 300);

          // Replace the hardcoded URL with an environment variable
          const validateUser = await fetch(
            `${
              process.env.NEXTAUTH_URL || req.nextUrl.origin
            }/api/auth/validCookie`,
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
        }
      } catch (e) {
        // Clear invalid cookies
        console.error("Error decrypting cookie:", e);
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
