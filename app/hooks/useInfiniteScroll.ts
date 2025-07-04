"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll<T>(
  initialItems: (T | null)[],
  initialCursor: string | null,
  fetchMore: (
    cursor: string | null
  ) => Promise<{ items: (T | null)[]; nextCursor: string | null }>
) {
  const [items, setItems] = useState<(T | null)[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialCursor);
  const observerTarget = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;

    setLoading(true);
    try {
      const { items: newItems, nextCursor } = await fetchMore(cursor);
      setItems((prev) => [...prev, ...newItems]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, fetchMore]);

  useEffect(() => {
    const currentObserverTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    setItems((prev) =>
      JSON.stringify(prev) === JSON.stringify(initialItems)
        ? prev
        : initialItems
    );
    setCursor((prev) => (prev === initialCursor ? prev : initialCursor));
    setHasMore((prev) => (prev === !!initialCursor ? prev : !!initialCursor));
  }, [initialItems, initialCursor]);

  return { items, loading, hasMore, observerTarget };
}
