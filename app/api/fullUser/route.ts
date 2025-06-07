import { getUserFull } from "@/app/lib/dal";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Helper to check if session cookie exists, which can indicate a recent login
async function hasSessionCookie() {
  const cookieStore = await cookies();
  return !!cookieStore.get("session");
}

export async function GET() {
  try {
    // First attempt to get the user
    let user = await getUserFull();

    // If no user but a session cookie exists, this might be right after login
    // where the session is still being established
    if (!user && (await hasSessionCookie())) {
      console.error(
        "Session cookie exists but no user found. Starting retry sequence..."
      );

      // Try multiple times with increasing delays
      const retryDelays = [150, 300, 600];
      for (const delay of retryDelays) {
        console.error(`Retrying getUser after ${delay}ms delay...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        user = await getUserFull();

        if (user) {
          console.error("User successfully retrieved on retry");
          break;
        }
      }
    }

    if (!user) {
      console.error("All retries failed. Returning 401 Unauthorized");
      const res = NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
      res.headers.set(
        "Set-Cookie",
        "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax"
      );
      return res;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in /api/me:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
