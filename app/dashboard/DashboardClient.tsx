"use client";

import React from "react";
import { useTheme } from "next-themes";
import defaultProfileDark from "@public/defaultProfileDark.svg";
import defaultProfileLight from "@public/defaultProfileLight.svg";
import PostCreator from "../ui/posts/PostCreater";
import type { User } from "../lib/definitions";

export default function DashboardClient({ user }: { user: User }) {
  const { theme } = useTheme();

  // Determine the default profile image based on the theme
  const defaultProfile =
    theme === "dark" ? defaultProfileDark.src : defaultProfileLight.src;

  // Use the user's image or fallback to the default profile image
  const profileImage = user?.image || defaultProfile;

  return (
    <div className=" flex w-full h-full justify-center ">
      <div className="min-w-6xl flex gap-4 md:gap-8 h-full">
        <div className="mainContent grow  pt-4 px-4 flex flex-col h-full border-r-1 border-x-[var(--borderc)]">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
          <PostCreator image={profileImage} />
        </div>
        <div className="sideContent w-fit max-w-xs">
          <h2 className="text-xl font-bold mb-4">Side Content</h2>
          <p>This is where you can add additional content or widgets.</p>
        </div>
      </div>
    </div>
  );
}
