export default function NavWrapper({
  children,
  className,
  fullBleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  fullBleed?: boolean;
}) {
  return (
    <div
      className={`w-full z-50 flex justify-center border-b-1 border-[var(--borderc)] ${className}`}
    >
      <div
        className={
          fullBleed
            ? "flex items-center w-full justify-center"
            : "pt-2 px-2 flex items-center w-full max-w-6xl justify-start sm:mr-10"
        }
      >
        {children}
      </div>
    </div>
  );
}
