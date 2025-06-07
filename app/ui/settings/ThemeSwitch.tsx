"use client";

import { setUserTheme } from "@/app/actions/userActions";
import { useCurrentUser } from "@/app/context/UserContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Image from "next/image";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const user = useCurrentUser();
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async () => {
    setIsSpinning(true);
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (user?.id) {
      await setUserTheme(nextTheme, user?.id); // Pass the user ID
    }
    setTheme(nextTheme);
    setTimeout(() => setIsSpinning(false), 700);
  };

  if (!mounted || !user) {
    // This prevents hydration mismatch by not rendering anything until mounted
    return null;
  }

  return (
    <div className="flex items-center gap-8 p-2 my-2 md:my-8 border-y-2 border-[var(--grey)]  w-full">
      <h2 className="text-2xl font-bold">Theme Toggle</h2>
      <button
        className={`w-20 rounded-l-3xl relative rounded-r-3xl bg-[var(--dmono-50)] text-[var(--rdmono)] h-11 rounded outline-2 ${
          theme === "dark"
            ? "outline-[var(--dmono-90)]"
            : "outline-[var(--darkgrey)]"
        } no-scale overflow-hidden`}
        onClick={handleThemeChange}
      >
        <div
          className={`h-10 w-10 absolute top-0.5 transition-all duration-300 ease ${
            theme === "dark" ? "left-[0.1rem]" : "left-[calc(100%-2.6rem)]"
          } bg-[var(--aBlack)] rounded-full shadow-md hover:shadow-lg z-50 ${
            isSpinning ? "spin-animation" : ""
          } flex items-center justify-center
          `}
        >
          <Image
            src={theme === "dark" ? "/moonPrimary.svg" : "/sun.svg"}
            alt={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
      </button>
    </div>
  );
}
