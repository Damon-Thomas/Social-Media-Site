"use client";

import { metadata } from "./lib/metadata";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "./ui/landing-page/ThemeSwitcher";
import Footer from "./ui/landing-page/Footer";
// import { SessionProvider } from "next-auth/react";

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
        {/* <SessionProvider> */}
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
