"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth < 350); // Adjust the threshold as needed
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`flex grow gap-2 justify-around ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`flex-1  text-center ${
            activeTab === tab
              ? "bg-[var(--primary)] text-[var(--aBlack)]"
              : "bg-[var(--dmono)] text-[var(--rdmono)]"
          } ${smallScreen ? "text-xs px-2 py-1 h-8" : "px-4 py-2 h-10"}`}
          onClick={() => setActiveTab(tab)}
        >
          {capitalize(tab)}
        </button>
      ))}
    </div>
  );
}
