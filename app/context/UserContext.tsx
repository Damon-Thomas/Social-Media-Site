"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/app/lib/definitions";

const UserContext = createContext<{
  user: User | null;
  refreshUser: () => void;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    if (res.ok) {
      setUser(await data);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  return ctx?.user;
}

export function useRefreshUser() {
  const ctx = useContext(UserContext);
  return ctx?.refreshUser;
}
