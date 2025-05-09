import { ReactNode } from "react";

export default function Modal({
  children,
  hidden = true,
  setHidden,
}: {
  children: ReactNode;
  hidden: boolean;
  setHidden?: () => void;
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
        onClick={setHidden} // Close modal when clicking outside
      />

      {/* Modal content */}
      <div className="relative bg-[var(--dmono)] text-[var(--rdmono)] rounded-lg shadow-lg p-10 z-10 w-full max-w-xl m-4">
        {/* Close button */}
        {setHidden && (
          <button
            onClick={setHidden}
            className="absolute top-3 right-3 text-[var(--rdmono)] bg-[var(--dmono)] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
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
