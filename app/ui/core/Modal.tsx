import { ReactNode } from "react";

export default function Modal({
  children,
  hidden = true,
  setHidden,
  className = "",
}: {
  children: ReactNode;
  hidden: boolean;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>; // Optional setHidden for modal control
  className?: string; // Optional className for additional styling
}) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300  ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="dialog"
      aria-hidden={hidden}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-[var(--rdmono-90)]  transition-opacity duration-300"
        onClick={() => {
          if (setHidden) {
            setHidden(!hidden);
          }
        }} // Close modal when clicking outside
      />

      {/* Modal content */}
      <div
        className={`relative text-[var(--rdmono)] rounded-md  z-10 w-full max-w-xl m-2  ${className}`}
      >
        {/* Close button */}
        {setHidden && (
          <button
            onClick={() => {
              if (setHidden) {
                setHidden(!hidden);
              }
            }}
            className="absolute top-3 right-3 leading-none text-[var(--aWhite)] text-2xl font-extrabold bg-transparent hover:scale-110 transition-transform duration-200 "
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

        {/* Modal content */}
        {children}
      </div>
    </div>
  );
}
