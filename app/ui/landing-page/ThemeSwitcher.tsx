// import { useTheme } from "next-themes";
import sun from "@public/sun.svg";
import moon from "@public/moon.svg";
import Image from "next/image";
import React, { useState, useEffect } from "react";
// import { useCurrentUser } from "@/app/context/UserContext";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);
  // const user = useCurrentUser();
  const { theme, setTheme } = useTheme();
  // const refreshUser = useRefreshUser();

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only set the theme from user context on first mount
  // useEffect(() => {
  //   if (user?.theme === "light" || user?.theme === "dark") {
  //     setTheme(user.theme);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setTheme]); // Only run on mount, not when user?.theme changes

  useEffect(() => {
    console.log("Theme changed to MASTS:", theme);
  }, [theme]);

  const handleThemeChange = async () => {
    setIsSpinning(true);
    // await setUserTheme(theme === "dark" ? "light" : "dark", user?.id || "");
    console.log("theme AASHDAIUADSHUADS", theme);
    setTheme(theme === "dark" ? "light" : "dark");
    console.log(
      "Theme changed to  alshadsjhsadkjadsh:",
      theme === "dark" ? "light" : "dark"
    );
    // refreshUser?.(); // <-- Refresh user context after DB update

    console.log("Theme set to:", theme === "dark" ? "dark" : "light");
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsSpinning(false);
    }, 700); // Match the animation duration (0.7s)
  };

  // Render a placeholder while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header>
        <button className="fixed top-4 right-4 p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="w-6 h-6"></div>
        </button>
      </header>
    );
  }

  return (
    <header>
      <button
        onClick={handleThemeChange}
        className={`fixed top-4 right-4 p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 z-50 ${
          isSpinning ? "spin-animation" : ""
        }`}
      >
        <Image
          src={theme === "dark" ? moon : sun}
          alt={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
    </header>
  );
}
