"use server";

import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client"; // Import the generated enums

export async function setUserTheme(theme: "light" | "dark", userId: string) {
  if (!userId || userId.trim() === "") {
    console.log("No user ID provided, skipping theme update");
    return null;
  }

  if (theme !== "light" && theme !== "dark") {
    throw new Error("Invalid theme value");
  }

  try {
    console.log("Updating user theme in DB:", theme, "for user:", userId);
    // First check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      console.error("User not found:", userId);
      return null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        theme: theme, // Simplified - Prisma will handle enum conversion
      },
      select: {
        id: true,
        theme: true,
      },
    });
    console.log("Theme updated in DB:", updatedUser.theme);
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user theme:", error);
    throw error;
  }
}
