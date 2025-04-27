// app/api/auth/clear-session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt, deleteSession } from "@/app/lib/session.server";
import prisma from "@/app/lib/prisma"; // Ensure you have your Prisma client imported

export async function GET() {
  console.log("GETETTEERRR");
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, message: "No session cookie found" },
      { status: 401 }
    );
  }

  try {
    // Decrypt the session cookie
    const session = await decrypt(sessionCookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid session payload" },
        { status: 401 }
      );
    }

    // Verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.userId.toString() },
    });
    console.log("User found in DB:", user);
    if (!user) {
      console.log("User not found in database");

      await deleteSession();
      // Respond with 401 Unauthorized for missing user to clear session and redirect
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // If everything is valid, return success
    return NextResponse.json({
      success: true,
      message: "Valid session and user",
    });
  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate session" },
      { status: 500 }
    );
  }
}
