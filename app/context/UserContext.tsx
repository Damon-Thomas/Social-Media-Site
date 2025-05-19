"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/app/lib/definitions";

const UserContext = createContext<{
  user: User | null;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (res.ok) {
        console.log("User data refreshed:", data);
        setUser(data);
      } else {
        console.error("Error refreshing user:", data);
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, isLoading }}>
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

export function useUserLoading() {
  const ctx = useContext(UserContext);
  return ctx?.isLoading;
}
