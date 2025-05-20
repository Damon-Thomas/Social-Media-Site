"use server";

import prisma from "../lib/prisma";
// import { Prisma } from "@prisma/client"; // Import the generated enums

export async function setUserTheme(theme: "light" | "dark", userId: string) {
  if (theme !== "light" && theme !== "dark") {
    throw new Error("Invalid theme value");
  }

  try {
    console.log("Updating user theme in DB:", theme);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { theme: theme },
    });
    console.log("Theme updated in DB:", updatedUser.theme);
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user theme:", error);
    throw error;
  }
}
