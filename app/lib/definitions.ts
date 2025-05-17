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
  theme?: string | null;
} | null;

export type SimpleUser = {
  id: string;
  name: string | null;
  image?: string | null;
  _count?: {
    followers: number;
  };
  theme: string | null;
};

export type Post = {
  id: string;
  content?: string | null;
  author?: User | null;
  authorId?: string | null;
  likedBy?: User[];
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
  likedBy?: User[];
  replies?: Comment[];
  parent?: Comment | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  Notification?: Notification[];
} | null;

export type CommentUnested = {
  id: string;
  content?: string | null;
  author?: User | null;
  authorId?: string | null;
  postId?: string | null;
  likedBy?: EssentialUser[];
  replies?: CommentUnested[];
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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

export type ActivityItem = {
  id: string;
  type: "post" | "comment" | "likedPost" | "likedComment";
  createdAt: Date;
  payload: EssentialPost | EssentialComment;
} | null;

export type Activity = {
  id: string;
  type: "post" | "comment" | "likedPost" | "likedComment";
  createdAt: Date;
  payload: EssentialPost | EssentialComment;
} | null;

export type EssentialUser = {
  id: string;
  name: string | null;
  image?: string | null;
} | null;

export type EssentialPost = {
  id: string;
  content?: string | null;
  author?: EssentialUser | null;
  authorId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    comments: number;
    likedBy: number;
  };
} | null;

export type EssentialComment = {
  id: string;
  content?: string | null;
  author?: EssentialUser | null;
  authorId?: string | null;
  postId?: string | null;
  likedBy?: EssentialUser[];
  replies?: BasicComment[];
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    likedBy: number;
    replies: number;
  };
} | null;

export type BasicComment = {
  id: string;
  content?: string | null;
  author?: EssentialUser | null;
  authorId?: string | null;
  postId?: string | null;
  _count?: {
    likedBy: number;
    replies: number;
  };
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

export type PostFeed = {
  id: string;
  content?: string | null;
  author?: EssentialUser | null;
  authorId?: string | null;
  likedBy?: EssentialUser[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
} | null;

type FollowingActivity = {
  id: string;
  posts: {
    id: string;
    content: string | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    _count: {
      comments: number;
      likedBy: number;
    };
  }[];
  comments: {
    id: string;
    content: string | null;
    authorId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    _count: {
      replies: number;
      likedBy: number;
    };
  }[];
};

export type GetFollowingActivitiesResult = {
  following: FollowingActivity[];
} | null;

export type FullPost = {
  id: string;
  content: string | null;
  authorId: string | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  comments: EssentialComment[];
  likedBy: {
    id: string;
    name: string;
    image: string | null;
  }[];
  _count: {
    comments: number;
    likedBy: number;
  };
  createdAt: Date;
  updatedAt: Date;
};
