export default function Nav({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={`flex items-center flex-wrap gap-2 md:gap-3 w-full ${className}`}
    >
      {children}
    </nav>
  );
}
