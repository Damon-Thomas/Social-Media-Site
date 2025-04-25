"use client";

import { useEffect, useState } from "react";
import Linker from "./Linker";
import Nav from "./Nav";
import NavWrapper from "./NavWrapper";
import NavLogo from "./NavLogo";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/session";

export default function Navigator() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Get the current route's pathname

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NavWrapper>
      <NavLogo />
      <Nav>
        <Linker active={pathname === "/dashboard"} route="/dashboard">
          Dashboard
        </Linker>
        <Linker
          active={pathname === "/dashboard/profile"}
          route="/dashboard/profile"
        >
          Profile
        </Linker>
        <Linker
          active={pathname === "/dashboard/settings"}
          route="/dashboard/settings"
        >
          Settings
        </Linker>
        <Linker
          active={pathname === "/dashboard/connections"}
          route="/dashboard/connections"
        >
          Connections
        </Linker>
        <Linker onClick={logout} type="logout">
          Logout
        </Linker>
      </Nav>
    </NavWrapper>
  );
}
