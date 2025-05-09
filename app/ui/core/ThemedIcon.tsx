export default function ThemedIcon({
  src,
  alt,
  liked = false,
  count = 0,
  size = 20,
  className = "",
  onClick,
  noTransition = false,
}: {
  src: string;
  alt: string;
  liked?: boolean;
  count?: number;
  size?: number;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  noTransition?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-start gap-0.5 h-5 min-w-12"
    >
      <div
        className={`${liked ? "bg-[var(--primary)]" : "bg-[var(--dull)]"} ${
          !noTransition ? "transition-colors duration-200" : ""
        } group-hover:bg-[var(--primary)] ${className}`}
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "cover",
          maskSize: "cover",
          width: size,
          height: size,
        }}
        aria-label={alt}
        role="img"
      />
      <div className="flex grow items-end h-full">
        <p
          className={`text-sm leading-none ${
            liked ? "text-[var(--primary)]" : "text-[var(--dull)]"
          } group-hover:text-[var(--primary)] ${
            !noTransition ? "transition-colors duration-200" : ""
          }`}
        >
          {count}
        </p>
      </div>
    </button>
  );
}
