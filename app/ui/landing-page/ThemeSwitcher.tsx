// import { useTheme } from "next-themes";

import Image from "next/image";
import React, { useState, useEffect } from "react";
// import { useCurrentUser } from "@/app/context/UserContext";
import { useTheme } from "next-themes";
import { setUserTheme } from "@/app/actions/userActions";
import { useCurrentUser } from "@/app/context/UserContext";

export default function ThemeSwitcher({
  inLine = false,
}: {
  inLine?: boolean;
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const user = useCurrentUser();

  // Add useEffect to handle client-side mounting
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

  // Render a placeholder while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      // <header>
      <button
        className={`${
          inLine ? "" : "fixed top-4 right-4"
        } hidden md:block p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300`}
      >
        <div className="w-6 h-6"></div>
      </button>
      // </header>
    );
  }

  return (
    // <header>
    <button
      onClick={handleThemeChange}
      className={`${
        inLine ? "" : "fixed top-4 right-4"
      } hidden md:block p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 z-50 ${
        isSpinning ? "spin-animation" : ""
      }`}
    >
      <Image
        src={theme === "dark" ? "/moon.svg" : "/sun.svg"}
        alt={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        width={24}
        height={24}
        className="w-6 h-6"
      />
    </button>
    // </header>
  );
}
