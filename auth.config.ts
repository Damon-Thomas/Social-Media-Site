import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: { user?: unknown } | null;
      request: { nextUrl: URL };
    }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true }, // Optional for login
      },
      async authorize(
        credentials: Partial<Record<"name" | "email" | "password", unknown>>
      ) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");
        const name = credentials?.name ? String(credentials.name) : undefined;

        if (!email) {
          throw new Error("Email is required.");
        }

        if (!password) {
          throw new Error("Password is required.");
        }

        // Existing logic for login and signup
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user && name) {
          // Signup flow
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
            data: { email, name, password: hashedPassword },
          });

          if (!newUser) {
            throw new Error("Failed to create account.");
          }

          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }

        if (user) {
          // Login flow
          const isPasswordValid =
            user.password && (await bcrypt.compare(password, user.password));
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
          return { id: user.id, email: user.email, name: user.name };
        }

        throw new Error("Invalid credentials or missing name for signup.");
      },
    }),
  ],
} satisfies NextAuthConfig;
