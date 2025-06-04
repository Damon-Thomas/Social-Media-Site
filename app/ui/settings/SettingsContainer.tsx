export default function SettingsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full">
      {children}
    </div>
  );
}
