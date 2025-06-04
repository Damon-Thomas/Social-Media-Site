export default function SettingsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-start mt-4 md:mt-8 w-full max-w-5xl h-full">
      {children}
    </div>
  );
}
