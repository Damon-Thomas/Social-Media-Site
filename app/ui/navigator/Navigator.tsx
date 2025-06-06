"use client";

import { useEffect, useState } from "react";
import Linker from "./Linker";
import Nav from "./Nav";
import NavWrapper from "./NavWrapper";
import NavLogo from "./NavLogo";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import NavGroup from "./NavGroup";
import ThemeSwitcher from "../landing-page/ThemeSwitcher";

export default function Navigator() {
  const [mounted, setMounted] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const pathname = usePathname(); // Get the current route's pathname

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth < 500); // Adjust the threshold as needed
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NavWrapper>
      {!smallScreen && <NavLogo />}
      <Nav className="xs:justify-between justify-stretch">
        <NavGroup>
          <Linker active={pathname === "/dashboard"} route="/dashboard">
            {smallScreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 fill-[var(--dmono)]"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2zm10 -4a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 -8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" />
              </svg>
            ) : (
              "Dashboard"
            )}
          </Linker>
          <Linker
            active={pathname === "/dashboard/profile"}
            route="/dashboard/profile"
          >
            {smallScreen ? "Sm" : "Profile"}
          </Linker>

          <Linker
            active={pathname === "/dashboard/connections"}
            route="/dashboard/connections"
          >
            {smallScreen ? "Sm" : "Connections"}
          </Linker>
          <Linker
            active={pathname === "/dashboard/settings"}
            route="/dashboard/settings"
          >
            {smallScreen ? "Sm" : "Settings"}
          </Linker>
        </NavGroup>
        <NavGroup className="justify-end items-center">
          <Linker onClick={logout} type="logout">
            {smallScreen ? "Sm" : "Logout"}
          </Linker>
          <ThemeSwitcher inLine={true} />
        </NavGroup>
      </Nav>
    </NavWrapper>
  );
}
