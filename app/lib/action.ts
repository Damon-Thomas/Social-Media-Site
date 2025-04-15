"use server";
import { verifySession } from "@/app/lib/dal";
import { z } from "zod";
import prisma from "./prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/session.server";
// import { AuthError } from "next-auth";

// interface FormSchemaType {
//   login: string;
//   name?: string;
//   email: string;
//   password: string;
//   confirmpassword?: string;
// }

const FormSchema = z
  .object({
    login: z.string().refine((val) => val === "true" || val === "false", {
      message: "Invalid login value.",
    }),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long.")
      .optional(),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmpassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.login === "false" && !data.name) {
      ctx.addIssue({
        path: ["name"],
        message: "Name is required for signup.",
        code: "custom",
      });
    }

    if (data.login === "false" && data.confirmpassword !== data.password) {
      ctx.addIssue({
        path: ["confirmpassword"],
        message: "Passwords do not match.",
        code: "custom",
      });
    }
  });

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

export async function authenticate(
  state:
    | {
        errors?: {
          login?: string;
          name?: string;
          email?: string;
          password?: string;
          confirmpassword?: string;
        };
        message?: string;
      }
    | undefined,
  payload: FormData
) {
  // Preprocess FormData to replace null or missing values with empty strings
  const processedData: Record<string, string> = {};
  payload.forEach((value, key) => {
    processedData[key] = value ? value.toString() : "";
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
      errors: {
        login: validatedFields.error.flatten().fieldErrors.login?.[0] || "",
        name: validatedFields.error.flatten().fieldErrors.name?.[0] || "",
        email: validatedFields.error.flatten().fieldErrors.email?.[0] || "",
        password:
          validatedFields.error.flatten().fieldErrors.password?.[0] || "",
        confirmpassword:
          validatedFields.error.flatten().fieldErrors.confirmpassword?.[0] ||
          "",
      },
      message: "Validation failed. Please check your input.",
    };
  }

  const { login, name, email, password } = validatedFields.data;

  if (login === "false") {
    if (!name || name.length < 2) {
      return {
        errors: { name: "Name must be at least 2 characters long." },
        message: "Validation failed. Please check your input.",
      };
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return {
        errors: { email: "Email already exists." },
        message: "Validation failed. Please check your input.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    if (!newUser) {
      return {
        errors: { message: "Failed to create account." },
        message: "Validation failed. Please check your input.",
      };
    }

    await createSession(newUser.id);
    redirect("/dashboard");
  } else {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        errors: { email: "Email not found." },
        message: "Validation failed. Please check your input.",
      };
    }

    const isPasswordValid =
      user.password && (await bcrypt.compare(password, user.password));
    if (!isPasswordValid) {
      return {
        errors: { password: "Invalid password." },
        message: "Validation failed. Please check your input.",
      };
    }

    await createSession(user.id);
    redirect("/dashboard");
  }
}
