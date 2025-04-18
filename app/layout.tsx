"use client";

import { metadata } from "./lib/metadata";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import sun from "../public/sun.svg";
import moon from "../public/moon.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import chevron from "../public/chevron-up.svg";
import pchevron from "../public/chevron-primary.svg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    setIsSpinning(true);
    setTheme(theme === "light" ? "dark" : "light");

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsSpinning(false);
    }, 700); // Match the animation duration (0.7s)
  };

  // Render a placeholder while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header>
        <button
          className={`fixed top-4 right-4 p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300`}
        >
          <div className="w-6 h-6"></div>
        </button>
      </header>
    );
  }

  return (
    <header>
      <button
        onClick={handleThemeChange}
        className={`fixed top-4 right-4 p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 ${
          isSpinning ? "spin-animation" : ""
        }`}
      >
        <Image
          src={theme === "light" ? sun : moon}
          alt={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
    </header>
  );
}

function Footer() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    <footer
      className={`fixed ${
        open ? "translate-y-0" : "translate-y-12"
      } bottom-0 w-screen bg-[var(--rbackground)] p-4 transition-all duration-500 ease-in-out`}
    >
      <div className="relative flex justify-center h-full w-full">
        <div className="absolute -top-8 transform -translate-y-1/2">
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer bg-[var(--background)] rounded-full p-1 w-8 h-8 flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <Image
              src={theme === "light" ? chevron : pchevron}
              alt="Open Footer"
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
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title ?? "Zuno")}</title>
        <meta
          name="description"
          content={String(metadata.description || "A social media website.")}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          <ThemeSwitcher />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
