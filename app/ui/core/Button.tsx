export default function Button({
  children,
  onClick,
  type = "button",
  style = "default",
  size = "medium",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  type?: "button" | "submit";
  style?: "default" | "bordered" | "text" | "primary" | "destructive";
  size?: "small" | "medium" | "large" | "fit";
  className?: string;
  disabled?: boolean;
}) {
  const buttonStyles = {
    default:
      "bg-[var(--dmono)] text-[var(--rdmono)] border-1 border-[var(--rdmono)]",
    bordered:
      "bg-[var(--rdmono)] text-[var(--dmono)] border-1 border-[var(--dmono)]",
    text: "bg-transparent text-[var(--dmono)] font-extrabold",
    primary: "bg-[var(--primary)] text-[var(--aBlack)] ",
    secondary: "bg-[var(--aBlack)] text-[var(--primary)]",
    destructive: "bg-[var(--danger)] text-[var(--aBlack)]",
  };
  const buttonSize = {
    small: "text-sm px-2 py-1 w-20",
    medium: "text-base px-4 py-2 w-24",
    large: "text-lg px-6 py-3 w-30",
    fit: "text-lg px-0 w-fit",
  };
  return (
    <button
      className={
        ` rounded whitespace-nowrap` +
        ` ${buttonStyles[style]} ${buttonSize[size]} ${className}`
      }
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
