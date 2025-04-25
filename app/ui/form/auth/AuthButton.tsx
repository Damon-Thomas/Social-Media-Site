export default function AuthButton({
  children,
  onClick,
}: {
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex grow items-center justify-center gap-2  h-fit px-4 py-2 bg-[var(--grey)] hover:bg-[var(--greyRing)] hover:cursor-pointer border border-[var(--greyRing)] rounded-3xl text-white font-semibold"
    >
      {children}
    </button>
  );
}
