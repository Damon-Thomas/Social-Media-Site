// app/ui/ThemeHydrationGuard.tsx
"use client";
import { useEffect, useState } from "react";

export default function ThemeHydrationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.classList.add("theme-hydrated");
  }, []);
  if (!mounted) return null;
  return <>{children}</>;
}
