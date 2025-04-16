export default function ErrorMessage({
  children,
  className,
}: Readonly<{
  children?: string;
  className?: string;
}>) {
  return (
    <div
      className={`text-sm h-6 text-red-500 font-medium ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
