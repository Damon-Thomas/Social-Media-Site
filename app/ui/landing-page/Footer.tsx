import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";

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
        } bottom-0 w-screen bg-zinc-900 dark:bg-yellow-500 p-4 transition-all duration-500 ease-in-out`}
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
          open ? "translate-y-0" : "translate-y-26"
        } h-28 bottom-0 w-screen text-[var(--background)]  bg-[var(--rbackground)] py-1 px-2 md:p-4 transition-all duration-500 ease-in-out z-20 safe-bottom`}
      >
        <div className="relative flex justify-center h-full w-full">
          <div className="absolute -top-4 md:-top-6 transform -translate-y-1/2">
            <div
              className="cursor-pointer rounded-full p-1 h-8 flex w-full items-center justify-center transition-colors duration-300"
              style={{ perspective: "1000px" }}
              onClick={() => setOpen(!open)}
            >
              {mounted ? (
                <Image
                  src={
                    theme === "light"
                      ? "/chevron-up.svg"
                      : "/chevron-primary.svg"
                  }
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
              ) : (
                <div style={{ width: 16, height: 16 }} />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between items-center w-full">
            <div className="flex gap-4 justify-around md:justify-between items-center w-full">
              <div className="flex flex-col items-center justify-between grow">
                <h4 className="text-lg font-bold  transition-colors duration-300">
                  Built by Damon Thomas
                </h4>
              </div>
              <div className="flex flex-col items-center gap-2 pt-2 md:pt-4 grow">
                <h4 className=" text-center transition-colors duration-300">
                  Get in touch with me
                </h4>
                <div className="icons flex items-center w-full justify-center">
                  <Image
                    src="/linkedIn.svg"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="mx-2 cursor-pointer"
                    onClick={() => {
                      location.href =
                        "https://www.linkedin.com/in/damon-thomas-445a39126/";
                    }}
                  />
                  {mounted ? (
                    <Image
                      src={
                        theme === "light"
                          ? "/github-mark-white.svg"
                          : "/github-mark.svg"
                      }
                      alt="GitHub"
                      width={24}
                      height={24}
                      className="mx-2 cursor-pointer"
                      onClick={() => {
                        location.href = "https://github.com/Damon-Thomas";
                      }}
                    />
                  ) : (
                    <div style={{ width: 24, height: 24 }} />
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm   transition-colors duration-300">
              © {new Date().getFullYear()} Zuno. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
