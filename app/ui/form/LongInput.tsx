"use client";

import { useRef, useEffect } from "react";

export default function LongInput({
  label,
  id,
  placeholder,
  value,
  onChange,
  className = "",
}: Readonly<{
  label: string;
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}>) {
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
    <div className="relative flex flex-col gap-1 w-full">
      <label htmlFor={id} className="block text-sm">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        rows={1}
        className={`w-full px-4 py-1 md:py-2 resize-none overflow-hidden text-xl focus:outline-none focus:ring-0 focus:border-none ${className}`}
      />
    </div>
  );
}
