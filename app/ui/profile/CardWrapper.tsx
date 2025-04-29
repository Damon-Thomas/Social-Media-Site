export default function CardWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`h-full w-full grow p-2 md:p-4 border-1 border-[var(--borderc] rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
