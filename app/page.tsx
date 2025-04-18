"use client";

import AuthForm from "./ui/auth-form";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import yellowNoBg from "../public/yellowNoBg.png";
import yellowRemoveBgPreview from "../public/yellow-removebg-preview.png";
import yellowmobile from "../public/mobileyellow.png";
import blackmobile from "../public/blackmobile.png";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start md:justify-center min-h-screen p-1 md:p-8 font-[family-name:var(--font-geist-sans)] bg-[var(--background)] transition-colors duration-500">
      <main className="flex flex-col grow md:flex-row items-center justify-start md:justify-around w-full">
        <div className="relative w-[150px] h-[50px] my-10 md:w-[400px] md:h-[400px]">
          {mounted && (
            <>
              <Image
                src={theme === "dark" ? yellowmobile : blackmobile}
                alt="Mobile version"
                fill
                style={{ objectFit: "contain" }}
                className="block md:hidden"
                priority
              />
              <Image
                src={theme === "dark" ? yellowNoBg : yellowRemoveBgPreview}
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
            </>
          )}
        </div>
        <AuthForm />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
