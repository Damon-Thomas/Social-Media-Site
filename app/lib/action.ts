"use server";
import { verifySession } from "@/app/lib/dal";
import { z } from "zod";
import prisma from "./prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/session.server";
import { google } from "googleapis";
import { Octokit } from "@octokit/rest";
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
    guest: z.union([z.boolean(), z.string()]).optional(),
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

type AuthState =
  | {
      errors: {
        login?: string;
        name?: string;
        email?: string;
        password?: string;
        confirmpassword?: string;
      };
      serverFormData?: {
        name?: string;
        email?: string;
        password?: string;
        confirmpassword?: string;
      };
      message?: string;
    }
  | {
      errors: { login: string };
      message?: string;
    }
  | undefined;

export async function serverAction(formData: FormData) {
  const session = await verifySession();
  console.log("session", session, formData);
}

export async function authenticate(state: AuthState, payload: FormData) {
  // 1. Check for OAuth login first
  const oauthProvider = payload.get("oauthProvider");
  const oauthCode = payload.get("oauthCode");

  if (oauthProvider && oauthCode) {
    // --- OAUTH HANDLING ---
    let oauthEmail: string | undefined;
    let oauthName: string | undefined;
    let profileImage: string | null = null;
    if (oauthProvider === "google") {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI // e.g. http://localhost:3000/api/oauth/google/callback
      );
      const { tokens } = await oauth2Client.getToken(oauthCode.toString());
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();
      oauthEmail = data.email || undefined;
      oauthName = data.name || undefined;
      profileImage = data.picture || null;
      console.log(profileImage);
    }

    if (oauthProvider === "github") {
      const octokit = new Octokit();
      // Exchange code for access token
      console.log("GitHub OAuth: exchanging code", oauthCode);
      const res = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${oauthCode}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );
      const data = await res.json();
      console.log("GitHub token exchange response:", data);
      const { access_token } = data;
      if (!access_token) {
        return { errors: { login: "GitHub OAuth failed." } };
      }
      // Get user info
      const { data: user } = await octokit.request("GET /user", {
        headers: { authorization: `token ${access_token}` },
      });

      // If email is not public, fetch from /user/emails
      let email = user.email;
      if (!email) {
        const emailsRes = await octokit.request("GET /user/emails", {
          headers: { authorization: `token ${access_token}` },
        });
        // Find the primary, verified email
        const primaryEmailObj = emailsRes.data.find(
          (e: { primary: boolean; verified: boolean; email: string }) =>
            e.primary && e.verified
        );
        email = primaryEmailObj?.email ?? null;
      }

      oauthEmail = email || undefined;
      oauthName = user.name || user.login || undefined;
      profileImage = user.avatar_url || null;
      console.log(
        "GitHub user data:",
        user,
        "oauthEmail",
        oauthEmail,
        "oauthName",
        oauthName,
        "profileImage",
        profileImage,
        "avatar_url",
        user.avatar_url
      );
    }
    console.log("OAuth login data:", {
      oauthProvider,
      oauthCode,
      oauthEmail,
      oauthName,
      profileImage,
    });
    if (!oauthEmail) {
      console.error("OAuth login failed: no email found.", {
        oauthProvider,
        oauthCode,
        oauthEmail,
        oauthName,
      });
      return { errors: { login: "OAuth login failed: no email found." } };
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: oauthEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: oauthName || "OAuth User",
          email: oauthEmail,
          password: null,
          image: profileImage || null,
        },
      });
    }
    await createSession(user.id);
    redirect("/dashboard");
    return; // Make sure to return so the rest of the function does not run!
  }

  // 2. Only run form validation if not OAuth
  // Preprocess FormData to replace null or missing values with empty strings
  const processedData: Record<string, string> = {};
  payload.forEach((value, key) => {
    processedData[key] = value ? value.toString() : "";
  });

  // Check if the user is a guest
  // If the user is a guest, create a session for the guest user
  // and redirect to the dashboard
  if (processedData["guest"] === "true") {
    let guestUser = await prisma.user.findFirst({
      where: {
        email: "guestUser@email.com",
      },
    });
    if (!guestUser) {
      guestUser = await prisma.user.create({
        data: {
          name: "Guest User",
          email: "guestUser@email.com",
          password: "12345678",
        },
      });
    }
    await createSession(guestUser.id);
    redirect("/dashboard");
    return;
  }

  // Create serverFormData once to reuse throughout the function
  const serverFormData = {
    name: processedData["name"],
    email: processedData["email"],
    password: processedData["password"],
    confirmpassword: processedData["confirmpassword"],
  };

  // Helper function to return error responses
  const returnWithError = (
    errors: Record<string, string>,
    message = "Validation failed. Please check your input."
  ) => {
    return {
      errors,
      serverFormData,
      message,
    };
  };

  const validatedFields = FormSchema.safeParse({
    login: processedData["login"],
    name: processedData["name"],
    email: processedData["email"],
    password: processedData["password"],
    confirmpassword: processedData["confirmpassword"],
  });

  // If validation fails, return both errors and form data
  if (!validatedFields.success) {
    return returnWithError({
      login: validatedFields.error.flatten().fieldErrors.login?.[0] || "",
      name: validatedFields.error.flatten().fieldErrors.name?.[0] || "",
      email: validatedFields.error.flatten().fieldErrors.email?.[0] || "",
      password: validatedFields.error.flatten().fieldErrors.password?.[0] || "",
      confirmpassword:
        validatedFields.error.flatten().fieldErrors.confirmpassword?.[0] || "",
    });
  }

  const { login, name, email, password } = validatedFields.data;

  if (login === "false") {
    if (!name || name.length < 2) {
      return returnWithError({
        name: "Name must be at least 2 characters long.",
      });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return returnWithError({ email: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    if (!newUser) {
      return returnWithError({ message: "Failed to create account." });
    }

    await createSession(newUser.id);
    redirect("/dashboard");
  } else {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return returnWithError({ email: "Email not found." });
    }

    const isPasswordValid =
      user.password && (await bcrypt.compare(password, user.password));
    if (!isPasswordValid) {
      return returnWithError({ password: "Invalid password." });
    }

    await createSession(user.id);
    redirect("/dashboard");
  }
}
