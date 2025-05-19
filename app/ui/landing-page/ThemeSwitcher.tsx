import { useTheme } from "next-themes";
import sun from "@/public/sun.svg";
import moon from "@/public/moon.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCurrentUser, useRefreshUser } from "@/app/context/UserContext";
import { setUserTheme } from "@/app/actions/userActions";

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useCurrentUser();
  const refreshUser = useRefreshUser();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Log theme changes
  useEffect(() => {
    if (mounted) {
      console.log('ThemeSwitcher theme updated:', resolvedTheme || theme);
    }
  }, [mounted, resolvedTheme, theme]);

  // Initialize theme based on user preference - only once after mounting
  useEffect(() => {
    if (mounted) {
      if (user?.theme) {
        // Only set if user preference exists and differs from current theme
        if (resolvedTheme !== user.theme) {
          console.log(`Initializing theme from user preference: ${user.theme}`);
          setTheme(user.theme);
        } else {
          console.log(`User theme matches current theme: ${user.theme}`);
        }
      } else {
        // If no user theme but we have a locally stored theme, use that
        const localTheme = localStorage.getItem('theme');
        console.log(`No user theme set. Local storage theme: ${localTheme || 'not set'}`);
      }
    }
  }, [user?.theme, mounted, setTheme, resolvedTheme]);

  const handleThemeChange = async () => {
    try {
      setIsSpinning(true);
      // Use resolvedTheme instead of theme to ensure we have the actual current theme
      const currentTheme = resolvedTheme || theme;
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      console.log(`Switching theme from ${currentTheme} to ${nextTheme}`);

      // First update UI immediately for responsiveness
      setTheme(nextTheme);

      // Then persist to database if user exists
      if (user?.id) {
        console.log(`Saving theme preference ${nextTheme} for user ${user.id}`);
        try {
          const result = await setUserTheme(nextTheme, user.id);
          console.log("Theme update result:", result);

          if (result) {
            // Force refresh user context to get updated theme
            if (refreshUser) {
              console.log("Refreshing user context after theme change");
              await refreshUser();
            }
          } else {
            console.error("Theme update returned null or undefined");
          }
        } catch (dbError) {
          console.error("Database theme update error:", dbError);
          // Don't revert UI theme on database error - keep UI consistent with user's choice
        }
      } else {
        console.log("No user logged in, theme only changed locally");
        // For non-logged in users, we still want to remember their preference in localStorage
        // This is handled by next-themes automatically via the storageKey
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
    } finally {
      // Ensure spinning animation completes with a minimum duration
      setTimeout(() => {
        setIsSpinning(false);
      }, 700);
    }
  };

  // Render a placeholder while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header>
        <button className="fixed top-4 right-4 p-3 bg-[var(--rbackground)] rounded-full shadow-md border border-gray-400 hover:shadow-lg transition-shadow duration-300 z-50">
          <div className="w-6 h-6"></div>
        </button>
      </header>
    );
  }

  // Use resolvedTheme to ensure we're looking at the actual applied theme
  const currentTheme = resolvedTheme || theme;
  
  console.log('ThemeSwitcher rendering with theme:', currentTheme);

  return (
    <header>
      <button
        onClick={handleThemeChange}
        className={`fixed top-4 right-4 p-3 bg-[var(--rbackground)] dark:bg-white hover:bg-[var(--primary)] dark:hover:bg-[var(--primary)] text-white dark:text-black rounded-full shadow-md hover:shadow-lg transition-all duration-300 z-50 ${
          isSpinning ? "spin-animation" : ""
        }`}
        aria-label={`Switch to ${
          currentTheme === "dark" ? "light" : "dark"
        } mode`}
      >
        <Image
          src={currentTheme === "dark" ? moon : sun}
          alt={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
          width={24}
          height={24}
          className="w-6 h-6"
          priority
        />
      </button>
    </header>
  );
}
