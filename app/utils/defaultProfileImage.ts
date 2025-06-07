import { useTheme } from "next-themes";

/**
 * Returns the correct default profile picture based on the current theme.
 * @returns {string} The URL of the default profile picture.
 */
export function useDefaultProfileImage(): string {
  const { theme } = useTheme();
  return theme === "dark"
    ? "/defaultProfileDark.svg"
    : "/defaultProfileLight.svg";
}
