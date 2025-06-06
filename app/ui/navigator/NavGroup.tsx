export default function NavGroup({
  children,
  className = "",
  bottom = false,
}: {
  children: React.ReactNode;
  className?: string;
  bottom?: boolean;
}) {
  // If w-full is present, add justify-evenly and items-center for full-width centered nav
  const fullWidth = className.includes("w-full");
  return (
    <div
      className={`flex ${bottom ? "" : "gap-2"} h-14 md:gap-4 ${
        fullWidth
          ? `w-full justify-evenly ${
              bottom ? "items-start gap-0" : "items-center"
            }`
          : ""
      } ${!fullWidth ? className : ""}`}
    >
      {children}
    </div>
  );
}
