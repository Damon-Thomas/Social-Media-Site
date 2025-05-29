"use server";

import { z } from "zod";
import prisma from "../lib/prisma";

const FormSchema = z.object({
  bio: z
    .string()
    .min(2, "Bio must be at least 2 characters long.")
    .max(500, "Bio must be at most 500 characters long."),
});

export type formState = {
  success: boolean;
  errors?: {
    bio?: string;
  };
  message?: string | null;
};

export type actionState = {
  prevState?: formState | undefined;
  data?: FormData;
};

export async function saveBio({
  userId,
  bio,
}: {
  userId: string;
  bio: string;
}): Promise<actionState> {
  if (!bio || typeof bio !== "string") {
    return {
      prevState: {
        success: false,
        errors: { bio: "Bio is required and must be a string." },
        message: null,
      },
    };
  }

  const validatedFields = FormSchema.safeParse({
    bio,
  });

  if (!validatedFields.success) {
    return {
      prevState: {
        success: false,
        errors: { bio: validatedFields.error.errors[0].message },
        message: "Validation failed",
      },
    };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { ...validatedFields.data },
    });
    return {
      prevState: {
        success: true,
        errors: undefined,
        message: "Bio updated successfully",
      },
    };
  } catch (error) {
    console.error("Failed to update bio:", error);
    return {
      prevState: {
        success: false,
        errors: { bio: "Failed to update bio. Please try again later." },
        message: null,
      },
    };
  }
}
