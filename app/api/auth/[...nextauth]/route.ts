import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        login: { label: "Login", type: "text", optional: true }, // "true" for login, "false" for register
        confirmpassword: {
          label: "Confirm Password",
          type: "password",
          optional: true,
        },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        const name = credentials?.name as string | undefined;
        const login = credentials?.login as string;
        const confirmpassword = credentials?.confirmpassword as
          | string
          | undefined;

        if (!email || !password)
          throw new Error("Email and password are required.");

        // Registration
        if (login === "false") {
          if (!name || name.length < 2)
            throw new Error("Name must be at least 2 characters.");
          if (!confirmpassword || confirmpassword !== password)
            throw new Error("Passwords do not match.");
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing) throw new Error("Email already exists.");
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
          });
          if (!user) throw new Error("Failed to create user.");
          return { id: user.id, name: user.name, email: user.email };
        }

        // Login
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) throw new Error("Invalid credentials.");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid credentials.");
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth", // Your custom auth page
    error: "/auth", // Show errors on the same page
  },
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
