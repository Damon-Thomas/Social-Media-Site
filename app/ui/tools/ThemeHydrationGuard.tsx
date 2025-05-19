// app/ui/tools/ThemeHydrationGuard.tsx
"use client";
import { useEffect, useState } from "react";

export default function ThemeHydrationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  // Handle initial hydration
  useEffect(() => {
    // Setting a timeout ensures that any initial theme processing has time to complete
    const timer = setTimeout(() => {
      setHydrated(true);
      console.log("Theme hydration complete");
    }, 100); // Increased timeout to ensure proper hydration

    return () => clearTimeout(timer);
  }, []);

  // This component ensures hydration happens before rendering children
  if (!hydrated) {
    // During SSR or before hydration, render a hidden version
    // that won't flash the wrong theme
    return (
      <div
        style={{
          visibility: "hidden",
          position: "fixed", // Changed from absolute to fixed to avoid layout issues
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          zIndex: -1, // Keep it behind everything else
        }}
      >
        {children}
      </div>
    );
  }

  // Children are only rendered with visibility after hydration
  return <>{children}</>;
}
