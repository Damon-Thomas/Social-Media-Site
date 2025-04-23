// app/ui/ThemeHydrationGuard.tsx
"use client";
import { useEffect } from "react";

export default function ThemeHydrationGuard({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  useEffect(() => {
    document.documentElement.classList.add("theme-hydrated");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      console.log("Dark theme applied");
    } else {
      root.classList.remove("dark");
      console.log("Light theme applied");
    }
  }, [theme]);

  return <>{children}</>;
}
