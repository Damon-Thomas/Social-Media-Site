// import { CSSProperties } from "react";

export default function ThemedIcon({
  src,
  alt,
  liked = false,
  count = 0,
  size = 20,
  className = "",
  onClick,
}: {
  src: string;
  alt: string;
  liked?: boolean;
  count?: number;
  size?: number;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-0.5 group">
      <div
        className={`${
          liked ? "bg-[var(--primary)]" : "bg-[var(--dull)]"
        } group-hover:bg-[var(--primary)] transition-colors duration-200 ${className}`}
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
      <p className="text-sm text-[var(--dull)] group-hover:text-[var(--primary)] transition-colors duration-200">
        {count}
      </p>
    </button>
  );
}
