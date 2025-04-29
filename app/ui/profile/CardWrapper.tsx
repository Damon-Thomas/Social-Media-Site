export default function CardWrapper({
  children,
  content = [],
  className,
}: {
  children: React.ReactNode;
  content?: Array<unknown>;
  className?: string;
}) {
  if (!content.length) {
    return (
      <div
        className={`grow p-2 flex flex-col gap-2 md:gap-4 md:p-4 border-1 w-full md:w-3xs border-[var(--borderc] rounded-lg overflow-hidden ${className}`}
      >
        <h2 className="font-bold text-lg">{children}</h2>
        <p>No {children?.toString().toLowerCase()} found</p>
      </div>
    );
  }
  return (
    <div
      className={`grow p-2 md:p-4 border-1 w-full md:w-3xs border-[var(--borderc] rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
