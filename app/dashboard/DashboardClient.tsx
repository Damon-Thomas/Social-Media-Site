"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import PostCreator from "../ui/posts/PostCreator";
import type { SimpleUser } from "../lib/definitions";
import Goats from "../ui/dashboard/Goats";
import Noobs from "../ui/dashboard/Noobs";
import PostSelector from "../ui/posts/PostSelector";
import PostContent from "../ui/posts/PostContent";

export default function DashboardClient({ user }: { user: SimpleUser }) {
  const [selectedFeed, setSelectedFeed] = useState("global");
  const { setTheme } = useTheme();
  const didSetTheme = useRef(false);

  useEffect(() => {
    if (!didSetTheme.current && user?.theme) {
      setTheme(user.theme);
      didSetTheme.current = true;
    }
  }, [user?.theme, setTheme]);

  return (
    <div className="flex grow w-full h-full justify-center">
      <div className="max-w-6xl flex gap-2 md:gap-4 h-full w-full">
        <div className="grow flex flex-col min-h-full h-fit border-x-1 border-x-[var(--borderc)]">
          <PostSelector
            selectedFeed={selectedFeed}
            setSelectedFeed={setSelectedFeed}
          />
          <PostCreator user={user} />
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
