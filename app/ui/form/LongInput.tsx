"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const LongInput = forwardRef(function LongInput(
  {
    label = null,
    id,
    placeholder,
    value,
    name = id,
    onChange,
    className = "",
    text = "text-xl",
    disabled = false,
    noPadding = false,
  }: Readonly<{
    label?: string | null;
    id: string;
    placeholder?: string;
    value?: string;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    text?: string;
    disabled?: boolean;
    noPadding?: boolean;
  }>,
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust height on value change
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate the correct scrollHeight
      textarea.style.height = "auto";
      // Set the height to match the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  // Expose a reset function to the parent component
  useImperativeHandle(ref, () => ({
    reset: () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto"; // Reset height to default
      }
    },
  }));

  // Handle input and resize
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }

    // Auto-resize without waiting for re-render
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col justify-center items-center grow gap-1 w-full h-full">
      {label && (
        <label htmlFor={id} className="block text-sm">
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        rows={1}
        disabled={disabled}
        className={`w-full ${
          noPadding ? "p-0" : "px-4 py-1 md:py-2"
        }resize-none overflow-hidden focus:outline-none focus:ring-0 focus:border-none ${text} ${className}`}
      />
    </div>
  );
});

export default LongInput;
