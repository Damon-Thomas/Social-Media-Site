"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import defaultProfileDark from "@public/defaultProfileDark.svg";
import defaultProfileLight from "@public/defaultProfileLight.svg";
import PostCreator from "../ui/dashboard/posts/PostCreater";
import type { SimpleUser } from "../lib/definitions";
import Goats from "../ui/dashboard/Goats";
import Noobs from "../ui/dashboard/Noobs";
import PostSelector from "../ui/dashboard/posts/PostSelector";
import PostContent from "../ui/dashboard/posts/PostCentent";

export default function DashboardClient({ user }: { user: SimpleUser }) {
  const { theme } = useTheme();
  const [selectedFeed, setSelectedFeed] = useState("global");
  // Determine the default profile image based on the theme
  const defaultProfile =
    theme === "dark" ? defaultProfileDark.src : defaultProfileLight.src;

  // Use the user's image or fallback to the default profile image
  const profileImage = user?.image || defaultProfile;

  return (
    <div className="flex grow w-full h-full justify-center ">
      <div className="max-w-6xl flex gap-4 md:gap-8 h-full w-full">
        <div className="grow flex flex-col h-full border-x-1 border-x-[var(--borderc)]">
          <PostSelector
            selectedFeed={selectedFeed}
            setSelectedFeed={setSelectedFeed}
          />
          <PostCreator image={profileImage} />
          <PostContent selectedFeed={selectedFeed} />
        </div>
        <div className="w-fit max-w-xs mr-2 md:mr-4 md:block hidden">
          <Goats />
          <Noobs />
          <Goats />
        </div>
      </div>
    </div>
  );
}
