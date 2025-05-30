"use client";

import type { Dispatch, SetStateAction } from "react";
import { capitalize } from "@/app/utils/capitalize";

export type Tab = "activity" | "posts" | "comments" | "liked";

interface ProfileSelectorsProps {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  className?: string; // Add className prop
}

export default function ProfileSelectors({
  activeTab,
  setActiveTab,
  className = "", // Destructure and provide default
}: ProfileSelectorsProps) {
  const tabs: Tab[] = ["activity", "posts", "comments", "liked"];

  return (
    <div className={`flex grow gap-2 justify-around ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`flex-1 px-4 py-2 h-10 text-center ${
            activeTab === tab
              ? "bg-[var(--primary)] text-[var(--aBlack)]"
              : "bg-[var(--dmono)] text-[var(--rdmono)]"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {capitalize(tab)}
        </button>
      ))}
    </div>
  );
}
