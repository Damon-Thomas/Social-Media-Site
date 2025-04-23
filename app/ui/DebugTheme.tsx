import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function DebugTheme() {
  const { theme } = useTheme();

  useEffect(() => {
    console.log("Current theme:", theme);
  }, [theme]);

  return null;
}
