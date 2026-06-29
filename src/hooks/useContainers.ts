"use client";

import { useCallback, useEffect, useState } from "react";
import { INITIAL_CONTAINERS } from "@/lib/containers/data";
import type { Container } from "@/lib/containers/types";

const STORAGE_KEY = "dashboards.containers.v1";

function loadFromStorage(): Container[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Container[];
    if (!Array.isArray(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(containers: Container[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(containers));
}

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    setContainers(stored ?? INITIAL_CONTAINERS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(containers);
  }, [containers, hydrated]);

  const startContainer = useCallback((id: string) => {
    setContainers((current) =>
      current.map((container) =>
        container.id === id
          ? { ...container, status: "running" as const }
          : container,
      ),
    );
  }, []);

  const stopContainer = useCallback((id: string) => {
    setContainers((current) =>
      current.map((container) =>
        container.id === id
          ? { ...container, status: "stopped" as const }
          : container,
      ),
    );
  }, []);

  const pauseContainer = useCallback((id: string) => {
    setContainers((current) =>
      current.map((container) =>
        container.id === id && container.status === "running"
          ? { ...container, status: "paused" as const }
          : container,
      ),
    );
  }, []);

  return {
    containers,
    hydrated,
    startContainer,
    stopContainer,
    pauseContainer,
  };
}
