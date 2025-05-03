export default function SelectorHighlight({ active }: { active: boolean }) {
  return (
    <div
      className={`h-1 w-full bg-[var(--primary)] rounded-3xl z-20 ${
        active ? "visible" : "invisible"
      }`}
    >
      {" "}
    </div>
  );
}
