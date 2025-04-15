"use server";
import { verifySession } from "@/app/lib/dal";
import { z } from "zod";
// import { AuthError } from "next-auth";

const FormSchema = z
  .object({
    login: z.string().refine((val) => val === "true" || val === "false", {
      message: "Invalid login value.",
    }),
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim()
      .optional()
      .default(""),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .trim(),
    confirmpassword: z.string().trim().optional().default(""),
  })
  .refine(
    (data) => data.login === "true" || (data.login === "false" && data.name),
    {
      message: "Name is required for signup.",
      path: ["name"],
    }
  )
  .refine(
    (data) => data.login === "true" || data.confirmpassword === data.password,
    {
      message: "Passwords do not match.",
      path: ["confirmpassword"],
    }
  );

export type State = {
  errors?: {
    login?: string;
    name?: string;
    email?: string;
    password?: string;
    confirmpassword?: string;
  };
  message?: string | null;
};

export async function serverAction(formData: FormData) {
  const session = await verifySession();
  console.log("session", session, formData);
}

export async function authenticate(prevState: State, formData: FormData) {
  // Preprocess FormData to replace null values with empty strings
  const processedData: Record<string, string> = {};
  formData.forEach((value, key) => {
    processedData[key] = value === null ? "" : value.toString();
  });

  const validatedFields = FormSchema.safeParse({
    login: processedData["login"],
    name: processedData["name"],
    email: processedData["email"],
    password: processedData["password"],
    confirmpassword: processedData["confirmpassword"],
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Authenticate.",
    };
  }

  console.log("formData", formData);
  try {
    const formDataObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formDataObject),
    });
    console.log("response", response);
    if (response.status === 404) {
      return {
        success: false,
        errors: { message: "Endpoint not found." },
      };
    }
    if (!response.ok) {
      const errorData = await response.json();
      console.log("errorData", errorData);
      return {
        success: false,
        errors: { message: errorData.message || "Authentication failed." },
      };
    }

    const result = await response.json();
    console.log("result", result);
    return { success: true, data: result };
  } catch (error) {
    console.log("Error during authentication:", error);
    return {
      success: false,
      errors: { message: error || "An unexpected error occurred." },
    };
  }
}
