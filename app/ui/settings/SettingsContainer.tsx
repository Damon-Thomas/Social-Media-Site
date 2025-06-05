export default function SettingsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex px-2 md:px-0 flex-col items-start justify-start w-full max-w-5xl h-full">
      {children}
    </div>
  );
}
