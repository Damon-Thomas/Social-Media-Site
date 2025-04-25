import Link from "next/link";
import { useTheme } from "next-themes";

export default function Linker({
  children,
  route,
  className,
  active,
  onClick,
  type,
}: {
  children: React.ReactNode;
  route?: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  type?: "logout";
}) {
  const { setTheme } = useTheme();

  const handleLogout = () => {
    setTheme("light"); // Reset theme to light
    document.documentElement.classList.remove("dark"); // Remove dark class from html
    if (onClick) {
      onClick();
    }
  };

  return type === "logout" ? (
    <button
      onClick={handleLogout}
      className={`flex items-center justify-center p-2 md:p-4 ${className} ${
        active
          ? "border-b-2 rounded-t-md border-[var(--dmono)] bg-[var(--opdmono)]"
          : ""
      }`}
    >
      {children}
    </button>
  ) : (
    <Link
      href={route || "#"}
      className={`flex items-center justify-center p-2 md:p-4 ${className} ${
        active
          ? "border-b-2 rounded-t-md border-[var(--dmono)] bg-[var(--opdmono)]"
          : ""
      }`}
    >
      {children}
    </Link>
  );
}
