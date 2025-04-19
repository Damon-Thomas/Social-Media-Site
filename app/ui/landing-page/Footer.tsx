import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import chevron from "@public/chevron-up.svg";
import pchevron from "@public/chevron-primary.svg";
import linkedIn from "@public/linkedIn.svg";
import githubWhite from "@public/github-mark-white.svg";
import githubBlack from "@public/github-mark.svg";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef(null);

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <footer
        className={`fixed ${
          open ? "translate-y-0" : "translate-y-12"
        } bottom-0 w-screen bg-[var(--rbackground)] p-4 transition-all duration-500 ease-in-out`}
      >
        {/* Placeholder content */}
      </footer>
    );
  }

  return (
    <>
      {/* Invisible hover trigger area */}
      <div
        className="fixed bottom-0 w-full h-[22px] z-10"
        onMouseEnter={() => setOpen(true)}
      />

      <footer
        ref={footerRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`fixed ${
          open ? "translate-y-0" : "translate-y-12"
        } bottom-0 w-screen bg-[var(--rbackground)] p-4 transition-all duration-500 ease-in-out z-20`}
      >
        <div className="relative flex justify-center h-full w-full">
          <div className="absolute -top-8 transform -translate-y-1/2">
            <div
              className="cursor-pointer rounded-full p-1 w-8 h-8 flex items-center justify-center theme-transition"
              style={{ perspective: "1000px" }}
              onClick={() => setOpen(!open)}
            >
              <Image
                src={theme === "light" ? chevron : pchevron}
                alt="Footer indicator"
                width={16}
                height={16}
                className={open ? "flip-vertical-active" : ""}
                style={{
                  transition: "transform 0.5s ease-in-out",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                  transform: open ? "rotateX(180deg)" : "rotateX(0deg)",
                }}
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-sm text-[var(--background)]">
              © {new Date().getFullYear()} Zuno. All rights reserved.
            </p>
            <div className="icons flex items-center justify-end">
              <Image
                src={linkedIn}
                alt="Icon 1"
                width={24}
                height={24}
                className="mx-2 cursor-pointer"
                onClick={() => {
                  location.href =
                    "https://www.linkedin.com/in/damon-thomas-445a39126/";
                }}
              />
              <Image
                src={theme === "light" ? githubWhite : githubBlack}
                alt="Icon 2"
                width={24}
                height={24}
                className="mx-2 cursor-pointer"
                onClick={() => {
                  location.href = "https://github.com/Damon-Thomas";
                }}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
