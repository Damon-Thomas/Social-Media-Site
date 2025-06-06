import Link from "next/link";

export default function Linker({
  children,
  route,
  className,
  active = false,
  onClick,
  type,
  bottom = false,
  feature = false,
}: {
  children: React.ReactNode;
  route?: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  type?: "logout";
  bottom?: boolean;
  feature?: boolean;
}) {
  const handleLogout = () => {
    if (onClick) {
      onClick();
    }
  };

  return type === "logout" ? (
    <button
      onClick={handleLogout}
      className={`flex items-center justify-center flex-1 min-w-0 p-2 md:p-4 ${className} ${
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
      className={`flex items-center justify-center flex-1 min-w-0 p-2 md:p-4 ${className} ${
        active
          ? bottom
            ? feature
              ? "border-t-2 border-x-2 rounded-t-md border-[var(--dmono)] bg-[var(--opdmono)]"
              : "border-t-2 border-[var(--dmono)] bg-[var(--opdmono)]"
            : "border-b-2 rounded-t-md border-[var(--dmono)] bg-[var(--opdmono)]"
          : ""
      }`}
    >
      {children}
    </Link>
  );
}
