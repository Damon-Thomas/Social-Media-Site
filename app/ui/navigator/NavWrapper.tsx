export default function NavWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex justify-center border-b-1 border-[var(--borderc)]`}
    >
      <div
        className={`pt-2 px-2  flex items-center w-full max-w-6xl justify-start mr-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
