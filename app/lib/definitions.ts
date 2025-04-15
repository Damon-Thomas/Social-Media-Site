import { z } from "zod";

export const AuthFormSchema = z
  .object({
    login: z.string().refine((val) => val === "true" || val === "false", {
      message: "Invalid login value.",
    }),
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim()
      .optional(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .trim(),
    confirmpassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .trim(),
  })
  .refine(
    (data) => data.login === "true" || (data.login === "false" && data.name),
    {
      message: "Name is required for signup.",
      path: ["name"],
    }
  )
  .refine((data) => data.confirmpassword === data.password, {
    message: "Passwords do not match.",
    path: ["confirmpassword"],
  });

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};
