import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session.server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];
// const homeRoute = "/";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip authentication for POST requests to root path
  if (path === "/" && req.method === "POST") {
    console.log("Skipping middleware for authentication action");
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  console.log("Middleware triggered for path:", path);

  // Read cookie from request
  const cookie = req.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (cookie) {
    try {
      const session = await decrypt(cookie);
      isAuthenticated = !!session?.userId;
      console.log("Session found with userId:", session?.userId);
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
      console.log("Validate user response, status:", validateUser.status);
      if (validateUser.status === 401) {
        console.log(
          "Session is invalid, clearing cookie and redirecting to home"
        );
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
      console.error("Invalid session:", e);

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
