"use client";

import type { Dispatch, SetStateAction } from "react";

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
    // Apply the passed className here
    <div className={`flex space-x-4 mb-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded ${
            activeTab === tab
              ? "bg-blue-500 text-white" // Example active style
              : "bg-gray-200 text-black" // Example inactive style
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
