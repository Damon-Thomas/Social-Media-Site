"use client";

import { useCurrentUser } from "@/app/context/UserContext";
import { useRef, useEffect, useState } from "react";
import ConnectCard from "./ConnectCard";
import { getProspects } from "@/app/actions/connectionActions";
import { useNotifications } from "@/app/context/NotificationContext";
import Button from "../core/Button";

export type ConnectUser = {
  id: string;
  name: string;
  image?: string | null;
  _count?: {
    followers?: number;
    posts?: number;
    comments?: number;
    friends?: number;
  };
};

export default function ConnectionContainer({
  type = "none",
  rows = 2,
}: {
  type?:
    | "none"
    | "friends"
    | "followers"
    | "following"
    | "friendRequestsSent"
    | "recentlyActive";
  rows?: number;
}) {
  const user = useCurrentUser();
  const { setNotifications } = useNotifications();

  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(175);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [prospects, setProspects] = useState<ConnectUser[]>([]);
  const [nextContent, setNextContent] = useState<"Next" | "End">("Next");
  const [previousContent, setPreviousContent] = useState<"Previous" | "Start">(
    "Previous"
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      const width = node.offsetWidth;
      if (width > 0) {
        setContainerWidth(width);
      }
    };

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(node);

    requestAnimationFrame(updateSize);

    if (window.innerWidth < 640) {
      setCardWidth(120);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerWidth > 0 && cardWidth > 0) {
      const count = Math.max(1, Math.floor(containerWidth / cardWidth));
      setItemsPerRow(count);
    }
  }, [containerWidth, cardWidth]);

  useEffect(() => {
    if (!user?.id || itemsPerRow <= 0) return;

    const fetchProspects = async () => {
      const limit = itemsPerRow * rows;
      // let newProspects;
      // if (type === "friends") {
      //   newProspects = await getFriendsPaginated(user.id, limit, page - 1);
      // } else {
      //   newProspects = await getProspects(user.id, limit, page - 1, type);
      // }
      const newProspects = await getProspects(user.id, limit, page - 1, type);
      console.log("Fetched prospects:", type, newProspects);
      if (!newProspects) {
        console.error("Failed to fetch prospects");
        setNotifications((prev) => [
          ...prev,
          "Failed to fetch prospects. Please try again later.",
        ]);
        return;
      }

      setPreviousContent(page === 1 ? "Start" : "Previous");

      if (newProspects?.length === limit) {
        setProspects(newProspects);
        setNextContent("Next");
      } else if (newProspects?.length > 0) {
        setProspects(newProspects);
        setNextContent("End");
      } else if (newProspects?.length === 0) {
        setProspects([]);
        setNextContent("End");
      } else {
        console.error("Failed to fetch prospects");
      }
      setLoaded(true);
    };

    fetchProspects();
  }, [user?.id, itemsPerRow, page, rows, type, setNotifications]);

  if (!user) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grow flex flex-col w-full overflow-hidden min-h-[1px]"
    >
      {!loaded ? (
        <div className="w-full p-1 mb-2">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: itemsPerRow * rows }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-32 sm:h-40 w-full"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {prospects.length === 0 && page === 1 && loaded ? (
            <div className="w-full h-48 grow flex items-center justify-center">
              <p className="text-xl">No connections found.</p>
            </div>
          ) : (
            <>
              <div className="w-full p-1 mb-2">
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
                  }}
                >
                  {prospects.length === 0 && page > 1 ? (
                    <div className="w-full col-span-4 h-48 flex items-center justify-center">
                      <p className="text-xl">No more connections found.</p>
                    </div>
                  ) : (
                    prospects.map((prospect) => (
                      <ConnectCard key={prospect.id} user={prospect} />
                    ))
                  )}
                </div>
              </div>
              <div className="w-full flex gap-2 justify-center items-center">
                <Button
                  className="grow no-scale hover:bg-[var(--rgtint)]"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  {previousContent}
                </Button>
                <Button
                  className="grow no-scale hover:bg-[var(--rgtint)]"
                  onClick={() => {
                    if (nextContent !== "End") setPage((prev) => prev + 1);
                  }}
                >
                  {nextContent}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
