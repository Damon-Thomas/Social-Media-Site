"use client";

import type { Dispatch, SetStateAction } from "react";

export type Tab = "activity" | "posts" | "comments" | "liked";

interface ProfileSelectorsProps {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
}

export default function ProfileSelectors({
  activeTab,
  setActiveTab,
}: ProfileSelectorsProps) {
  const tabs: Tab[] = ["activity", "posts", "comments", "liked"];

  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded ${
            activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
