import "server-only";
import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session.server";
import { cache } from "react";

export const verifySession = cache(async () => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) {
      console.log("No session cookie found");
      return null;
    }

    console.log("Session cookie exists, attempting to decrypt");
    const session = await decrypt(cookie);
    if (!session) {
      console.log("Failed to decrypt session cookie");
      return null;
    }

    if (!session?.userId) {
      console.log("Session decrypted but no userId found");
      return null;
    }

    // Verify the user actually exists in the database
    console.log(`Looking up user with ID: ${session.userId}`);
    const user = await prisma.user.findUnique({
      where: { id: session.userId.toString() },
      select: { id: true },
    });

    // If user doesn't exist in DB, return null
    if (!user) {
      console.log("User not found in database");
      return null;
    }

    console.log("Valid session found for user", user.id);
    return { isAuth: true, userId: session.userId };
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
});

export const getUser = cache(async () => {
  const session = await verifySession();
  console.log("Session in getUser:", session);
  if (!session) {
    console.log("No valid session found in getUser");
    return null;
  }

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
        following: {
          select: {
            id: true,
            name: true,
          },
        },
        friends: {
          select: {
            id: true,
            name: true,
          },
        },
        theme: true,
      },
    });

    const user = data;

    return user;
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});

export const getUserFull = cache(async () => {
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
        bio: true,
        createdAt: true,
        updatedAt: true,
        profileId: true,
        friendRequestsReceived: true,
        friendRequestsSent: true,
        friends: true,
        friendsOfUser: true,
        followers: true,
        following: true,
        receivedNotifications: true,
        createdNotifications: true,
        likedPosts: true,
        likedComments: true,
        posts: true,
        comments: true,
        // password: false,
      },
    });

    return data;
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});
