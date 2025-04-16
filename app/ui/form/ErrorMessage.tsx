export default function ErrorMessage({
  children,
  className,
}: Readonly<{
  children?: string;
  className?: string;
}>) {
  return (
    <div
      className={`flex items-start py-1 text-xs md:text-sm h-3 md:h-5 leading-0 text-red-500 font-medium ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
