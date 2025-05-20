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
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
