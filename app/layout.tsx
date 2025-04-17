"use client";

import { metadata } from "./lib/metadata";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";

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
        className="bg-white"
      >
        switch theme
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
