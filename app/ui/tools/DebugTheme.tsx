import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/app/context/UserContext";

export default function DebugTheme() {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const user = useCurrentUser();

  useEffect(() => {
    const localTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    console.log("Current theme state:", {
      themeProviderValue: theme,
      resolvedTheme,
      systemTheme,
      userTheme: user?.theme,
      localStorageTheme: localTheme,
      htmlClasses:
        typeof document !== "undefined"
          ? document.documentElement.classList.toString()
          : "N/A",
      userId: user?.id || "not logged in",
    });
  }, [theme, resolvedTheme, systemTheme, user?.theme, user?.id]);

  // Only add the debug UI in development
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 left-4 p-2 bg-black/50 text-white text-xs z-50 rounded">
        Theme: {theme} | Resolved: {resolvedTheme} | User:{" "}
        {user?.theme || "none"}
      </div>
    );
  }

  return null;
}
