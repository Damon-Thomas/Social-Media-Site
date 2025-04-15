"use server";
import { verifySession } from "@/app/lib/dal";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";

export async function serverAction(formData: FormData) {
  const session = await verifySession();
  console.log("session", session, formData);
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const formDataObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });
    await signIn("credentials", formDataObject);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
