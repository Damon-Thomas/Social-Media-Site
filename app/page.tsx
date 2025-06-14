"use client";

import AuthForm from "./ui/form/auth/auth-form";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Footer from "./ui/landing-page/Footer";
import ThemeSwitcher from "./ui/landing-page/ThemeSwitcher";
// import { validateSessionOrClear } from "@/app/actions/auth";
// import { verify } from "crypto";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally, render a minimal placeholder to avoid hydration mismatch
    return null;
  }

  return (
    <>
      <ThemeSwitcher />
      <div className="flex flex-col items-center justify-start md:justify-center min-h-screen p-1 md:p-8 font-[family-name:var(--font-geist-sans)] landing">
        <main className="flex flex-col grow md:flex-row items-center justify-start md:justify-around w-full pb-10">
          <div className="relative w-[150px] h-[50px] my-10 md:w-[400px] md:h-[400px]">
            <Image
              src={theme === "dark" ? "/mobileyellow.png" : "/blackmobile.png"}
              alt="Mobile version"
              fill
              style={{ objectFit: "contain" }}
              className="block md:hidden"
              priority
            />
            <Image
              src={
                theme === "dark"
                  ? "/yellowNoBg.png"
                  : "/yellow-removebg-preview.png"
              }
              alt={
                theme === "dark"
                  ? "Zuno brand logo dark"
                  : "Zuno brand logo light"
              }
              fill
              style={{ objectFit: "contain" }}
              className="hidden md:block"
              priority
            />
          </div>
          <AuthForm />
        </main>
      </div>
      <Footer />
    </>
  );
}
