export default function NavGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex gap-2 md:gap-4 ${className}`}>{children}</div>;
}
