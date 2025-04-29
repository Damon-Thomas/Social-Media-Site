import { z } from "zod";
// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }

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

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  password?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  posts?: Post[];
  comments?: Comment[];
  profileId?: string | null;
  friendRequestsReceived?: User[];
  friendRequestsSent?: User[];
  friends?: User[];
  friendsOfUser?: User[];
  followers?: User[];
  following?: User[];
  receivedNotifications?: Notification[];
  createdNotifications?: Notification[];
  likedPosts?: Post[];
  likedComments?: Comment[];
} | null;

export type Post = {
  id: string;
  content?: string | null;
  author?: User | null;
  authorId?: string | null;
  likes?: User[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
  Notification?: Notification[];
} | null;

export type Comment = {
  id: string;
  content?: string | null;
  author?: User | null;
  authorId?: string | null;
  post?: Post | null;
  postId?: string | null;
  likes?: User[];
  replies?: Comment[];
  parent?: Comment | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  Notification?: Notification[];
} | null;

export type Profile = {
  id: string;
  bio?: string | null;
  user?: User | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string | null;
} | null;

export type Notification = {
  id: string;
  userId: string;
  user: User;
  type: string;
  seen: boolean;
  postId?: string | null;
  post?: Post | null;
  commentId?: string | null;
  comment?: Comment | null;
  createdBy?: string | null;
  creator?: User | null;
  createdAt: Date;
  updatedAt: Date;
} | null;
