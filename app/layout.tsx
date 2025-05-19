"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "./ui/landing-page/ThemeSwitcher";
import ThemeHydrationGuard from "./ui/tools/ThemeHydrationGuard";
import DebugTheme from "./ui/tools/DebugTheme";
import Head from "./head";
import { UserProvider } from "./context/UserContext";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Monitor and log hydration issues
  useEffect(() => {
    console.log("Root layout mounted");
    document.documentElement.classList.add("js-loaded");

    // Log any theme-related classes
    console.log("HTML classes:", document.documentElement.className);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <style jsx global>{`
        /* Debug outline to see what's rendering */
        .debug-outline * {
          outline: 1px solid rgba(255, 0, 0, 0.2);
        }
        /* Show hydration status */
        html.js-loaded .hydration-indicator {
          background-color: green;
        }
      `}</style>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased debug-outline`}
      >
        {/* Hydration status indicator */}
        <div className="hydration-indicator fixed top-0 left-0 w-2 h-2 bg-red-500 z-[9999]"></div>
        <UserProvider>
          <ThemeHydrationGuard>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              storageKey="theme"
              disableTransitionOnChange={
                false
              } /* Enable smoother transitions */
            >
              <DebugTheme />
              <ThemeSwitcher />
              <main className="transition-colors duration-300">{children}</main>
            </ThemeProvider>
          </ThemeHydrationGuard>
        </UserProvider>
      </body>
    </html>
  );
}
