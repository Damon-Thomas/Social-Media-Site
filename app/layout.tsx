"use client";

import { metadata } from "./lib/metadata";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import sun from "../public/sun.svg";
import moon from "../public/moon.svg";
import Image from "next/image";

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
  return (
    <footer>
      <button
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
        className="fixed top-4 right-4 p-2 bg-[var(--rbackground)] rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <Image
          src={theme === "light" ? sun : moon}
          alt={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          width={24}
          height={24}
          className="w-6 h-6"
        />
        {/* {moon} */}
        {/* <span className="sr-only">
          Toggle {theme === "light" ? "dark" : "light"} mode
        </span> */}
      </button>
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
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
