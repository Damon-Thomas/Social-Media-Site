"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "./ui/landing-page/ThemeSwitcher";
import Head from "./head";
import { UserProvider } from "./context/UserContext";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          // defaultTheme="light"
          enableSystem={false}
          // value={{ light: "light", dark: "dark" }}
        >
          <UserProvider>
            {/* <DebugTheme /> */}
            <ThemeSwitcher />
            <main className="transition-colors duration-300">{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
