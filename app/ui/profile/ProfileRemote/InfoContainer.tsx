export default function InfoContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-1/2 overflow-y-auto">{children}</div>;
}
