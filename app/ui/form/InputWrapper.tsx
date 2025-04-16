export default function InputWrapper({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`flex flex-col gap-1 md:gap-2 items-start justify-start ${className}`}
    >
      {children}
    </div>
  );
}
