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
        <Linker active={pathname === "/profile"} route="/profile">
          Profile
        </Linker>
        <Linker active={pathname === "/settings"} route="/settings">
          Settings
        </Linker>
        <Linker onClick={logout} type="logout">
          Logout
        </Linker>
      </Nav>
    </NavWrapper>
  );
}
