export default function Input({
  id,
  label = "",
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: Readonly<{
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}>) {
  return (
    <div className="relative flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="block text-sm">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-9 md:h-10 px-4 py-1 md:py-2 bg-[var(--grey)] border border-[var(--greyRing)] rounded-xs ${className}`}
      />
    </div>
  );
}
