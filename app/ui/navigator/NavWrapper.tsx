export default function NavWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={` flex items-center w-full justify-start ${className}`}>
      {children}
    </div>
  );
}
