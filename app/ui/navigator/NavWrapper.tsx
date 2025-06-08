export default function NavWrapper({
  children,
  className,
  smallScreen = false,
  fullBleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  smallScreen?: boolean;
  fullBleed?: boolean;
}) {
  return (
    <div
      className={`w-full z-50 flex justify-center bg-[var(--rdmono)] border-b-1 border-[var(--borderc)] ${className} ${
        smallScreen ? "fixed bottom-0 left-0 safe-bottom" : ""
      }`}
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
