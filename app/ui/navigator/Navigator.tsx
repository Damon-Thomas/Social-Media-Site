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
    <NavWrapper fullBleed={smallScreen}>
      {!smallScreen && <NavLogo />}
      <Nav
        className={`${
          smallScreen ? "w-full justify-stretch px-2 " : "justify-between"
        }`}
      >
        <NavGroup
          className={
            smallScreen ? "w-full flex flex-row justify-between h-fit pb-1" : ""
          }
          bottom={smallScreen}
        >
          {smallScreen ? (
            <>
              <div className="flex border-t-1 border-[var(--borderc)] justify-center items-start w-1/5 h-full">
                <Linker
                  active={pathname === "/dashboard/profile"}
                  route="/dashboard/profile"
                  bottom={true}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-9 w-9 stroke-[var(--dmono)]"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                    <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                  </svg>
                </Linker>
              </div>
              <div className="flex justify-center border-t-1 border-[var(--borderc)] items-start w-1/5 h-full">
                <Linker
                  active={pathname === "/dashboard/connections"}
                  route="/dashboard/connections"
                  bottom={true}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-9 w-9 stroke-[var(--dmono)]"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                  </svg>
                </Linker>
              </div>
              <div className="flex bg-[var(--rdmono)] border-1 border-[var(--borderc)] rounded-t-md justify-center items-start -translate-y-4  w-1/5 h-fit">
                <Linker
                  active={pathname === "/dashboard"}
                  route="/dashboard"
                  bottom={true}
                  feature={true}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-14 w-12 fill-[var(--dmono)]"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2zm10 -4a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 -8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" />
                  </svg>
                </Linker>
              </div>
              <div className="flex justify-center border-t-1 border-[var(--borderc)] items-start w-1/5 h-full">
                <Linker
                  active={pathname === "/dashboard/settings"}
                  route="/dashboard/settings"
                  bottom={true}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-9 w-9 stroke-[var(--dmono)]"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 8h4v4h-4z" />
                    <path d="M6 4l0 4" />
                    <path d="M6 12l0 8" />
                    <path d="M10 14h4v4h-4z" />
                    <path d="M12 4l0 10" />
                    <path d="M12 18l0 2" />
                    <path d="M16 5h4v4h-4z" />
                    <path d="M18 4l0 1" />
                    <path d="M18 9l0 11" />
                  </svg>
                </Linker>
              </div>
              <div className="flex justify-center border-t-1 border-[var(--borderc)] items-start w-1/5 h-full">
                <Linker onClick={logout} type="logout">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-9 w-9 stroke-[var(--dmono)]"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M9 12h12l-3 -3" />
                    <path d="M18 15l3 -3" />
                  </svg>
                </Linker>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 flex justify-center">
                <Linker active={pathname === "/dashboard"} route="/dashboard">
                  Dashboard
                </Linker>
              </div>
              <Linker
                active={pathname === "/dashboard/profile"}
                route="/dashboard/profile"
              >
                Profile
              </Linker>
              <Linker
                active={pathname === "/dashboard/connections"}
                route="/dashboard/connections"
              >
                Connections
              </Linker>
              <Linker
                active={pathname === "/dashboard/settings"}
                route="/dashboard/settings"
              >
                Settings
              </Linker>
            </>
          )}
        </NavGroup>
        {/* Only show the second NavGroup (logout, theme) on large screens */}
        {!smallScreen && (
          <NavGroup className="justify-end items-center">
            <Linker onClick={logout} type="logout">
              Logout
            </Linker>
            <ThemeSwitcher inLine={true} />
          </NavGroup>
        )}
      </Nav>
    </NavWrapper>
  );
}
