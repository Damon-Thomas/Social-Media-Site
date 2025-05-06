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
    setItems(initialItems);
    setCursor(initialCursor);
    setHasMore(!!initialCursor);
  }, [initialItems, initialCursor]);

  useEffect(() => {
    console.log("Observer target updated:", observerTarget.current);
    console.log("Has more:", hasMore);
    console.log("Loading:", loading);
  }, [hasMore, loading, observerTarget]);

  return { items, loading, hasMore, observerTarget };
}
