"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/app/lib/definitions";

const UserContext = createContext<{
  user: User | null;
  fullUser: User | null;
  refreshUser: () => void;
  isLoading: boolean;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (isInitialLoad = false) => {
    try {
      setIsLoading(true);

      // If it's the initial load, add a small delay to give the cookie time to be set
      if (isInitialLoad) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      const res = await fetch("/api/me");
      const res2 = await fetch("/api/fullUser");
      const data = await res.json();
      const data2 = await res2.json();
      if (res.ok && res2.ok) {
        setUser(data);
        setFullUser(data2);
        setIsLoading(false);
      } else if (res.status === 401 || res2.status === 401) {
        // If first attempt fails with 401, try again with exponential backoff
        // This handles the race condition during login
        let retryCount = 0;
        const maxRetries = 4; // Increase max retries

        const retryFetch = async () => {
          if (retryCount >= maxRetries) {
            setIsLoading(false);
            return;
          }

          retryCount++;
          const delay = 1000 * Math.pow(1.5, retryCount - 1); // Adjusted backoff strategy
          console.log(
            `Retrying user fetch (${retryCount}/${maxRetries}) after ${delay}ms`
          );

          setTimeout(async () => {
            try {
              const retryRes = await fetch("/api/me", {
                // Add cache busting to prevent cached 401 responses
                headers: {
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache",
                },
              });
              const retryRes2 = await fetch("/api/fullUser", {
                headers: {
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache",
                },
              });
              const retryData = await retryRes.json();
              const retryData2 = await retryRes2.json();
              if (retryRes.ok && retryRes2.ok) {
                setUser(retryData);
                setFullUser(retryData2);
                setIsLoading(false);
              } else if (retryRes.status === 401 && retryCount < maxRetries) {
                retryFetch();
              } else {
                setIsLoading(false);
              }
            } catch (error) {
              console.error("Error retrying user fetch:", error);
              setIsLoading(false);
            }
          }, delay);
        };

        retryFetch();
        return;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt to fetch user data when we're in the browser
    if (typeof window !== "undefined") {
      refreshUser(true);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <UserContext.Provider value={{ user, refreshUser, fullUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  return ctx?.user;
}

export function useFullUser() {
  const ctx = useContext(UserContext);
  return ctx?.fullUser;
}

export function useRefreshUser() {
  const ctx = useContext(UserContext);
  return ctx?.refreshUser;
}

export function useUserLoading() {
  const ctx = useContext(UserContext);
  return ctx?.isLoading;
}
