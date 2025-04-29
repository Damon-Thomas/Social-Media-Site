import { useTheme } from "next-themes";
import sun from "@public/sun.svg";
import moon from "@public/moon.svg";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    setIsSpinning(true);
    setTheme(theme === "dark" ? "light" : "dark");

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
