import "server-only";
import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session.server";
import { cache } from "react";

export const verifySession = cache(async () => {
  console.log("Verifying session...");
  try {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) {
      console.log("No session cookie found.");
      return null;
    }

    const session = await decrypt(cookie);
    if (!session) {
      console.log("Session decryption failed.", session);
      return null;
    }
    console.log("Session decrypted successfully:", session);

    if (!session?.userId) return null;

    // Verify the user actually exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.userId.toString() },
      select: { id: true },
    });
    console.log("User found in DB:", user);

    // If user doesn't exist in DB, return null
    if (!user) {
      console.log("User not found in database");
      return null;
    }

    return { isAuth: true, userId: session.userId };
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.user.findUnique({
      where: {
        id: session.userId.toString(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const user = data;

    return user;
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});
