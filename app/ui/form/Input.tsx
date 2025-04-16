export default function Input({
  type,
  id,
  placeholder,
  className,
  label,
  labelClassName,
  ...props
}: Readonly<{
  type: string;
  id: string;
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
}>) {
  return (
    <>
      <label
        className={labelClassName + " text-[var(--offwhite)]"}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={id}
        id={id}
        className={`w-full h-9 md:h-10 px-4 py-1 md:py-2 bg-[var(--grey)] border border-[var(--greyRing)] rounded-xs ${className}`}
        {...props}
      />
    </>
  );
}
