import { useTheme } from "next-themes";
import defaultProfileDark from "@public/defaultProfileDark.svg";
import defaultProfileLight from "@public/defaultProfileLight.svg";

/**
 * Returns the correct default profile picture based on the current theme.
 * @returns {string} The URL of the default profile picture.
 */
export function useDefaultProfileImage(): string {
  const { theme } = useTheme();

  return theme === "dark" ? defaultProfileDark.src : defaultProfileLight.src;
}
