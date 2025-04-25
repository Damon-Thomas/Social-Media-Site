"use client";

import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import defaultProfileDark from "@public/defaultProfileDark.svg";
import defaultProfileLight from "@public/defaultProfileLight.svg";
import PostCreator from "../ui/posts/PostCreater";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

export default function DashboardClient({ user }: { user: User }) {
  const { theme } = useTheme();

  // Determine the default profile image based on the theme
  const defaultProfile =
    theme === "dark" ? defaultProfileDark : defaultProfileLight;

  // Use the user's image or fallback to the default profile image
  console.log("User image:", user, user.image);
  const profileImage = user.image || defaultProfile;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
      <Image
        src={profileImage}
        alt="User profile picture"
        width={100}
        height={100}
        className="rounded-full mb-4"
      />
      <PostCreator />
    </div>
  );
}
