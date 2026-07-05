"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiClient, getClientId } from "@/lib/api-client";

const STORAGE_KEY = "llm-lab-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored) as string[]));
      }
    } catch {
      setFavorites(new Set());
    }
  }, []);

  useEffect(() => {
    if (synced) return;
    const sync = async () => {
      try {
        const client = getApiClient();
        const { data } = await client.get<string[]>("/favorites");
        if (Array.isArray(data) && data.length > 0) {
          const merged = new Set([...favorites, ...data]);
          setFavorites(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...merged]));
        } else if (favorites.size > 0) {
          await client.post("/favorites/sync", {
            experimentIds: [...favorites],
          });
        }
      } catch {
        // offline or API unavailable
      } finally {
        setSynced(true);
      }
    };
    void sync();
  }, [favorites, synced]);

  const persist = useCallback((next: Set<string>) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    getApiClient()
      .post("/favorites/sync", { experimentIds: [...next] })
      .catch(() => undefined);
  }, []);

  const toggleFavorite = useCallback(
    (key: string) => {
      const next = new Set(favorites);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      persist(next);
      getApiClient()
        .patch(`/favorites/${key}/toggle`)
        .catch(() => undefined);
    },
    [favorites, persist]
  );

  const isFavorite = useCallback(
    (key: string) => favorites.has(key),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, clientId: getClientId() };
}
