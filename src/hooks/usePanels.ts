"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { advanceData, createInitialData } from "@/lib/charts/data";
import type { ChartSize, ChartType, Panel } from "@/lib/charts/types";
import { CHART_TYPE_DEFAULT_TITLES } from "@/lib/charts/types";

const TICK_INTERVAL_MS = 1500;
const STORAGE_KEY = "dashboards.panels.v1";

type PersistedState = {
  panels: Panel[];
  activePanelId: string | null;
};

function loadFromStorage(): PersistedState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(parsed.panels)) return null;

    return {
      panels: parsed.panels,
      activePanelId: parsed.activePanelId ?? null,
    };
  } catch {
    return null;
  }
}

function saveToStorage(panels: Panel[], activePanelId: string | null) {
  if (typeof window === "undefined") return;

  const state: PersistedState = { panels, activePanelId };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePanels() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setPanels(stored.panels);
      const activeExists = stored.panels.some(
        (panel) => panel.id === stored.activePanelId,
      );
      setActivePanelId(
        activeExists ? stored.activePanelId : (stored.panels[0]?.id ?? null),
      );
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(panels, activePanelId);
  }, [panels, activePanelId, hydrated]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;

      setPanels((current) =>
        current.map((panel) => ({
          ...panel,
          charts: panel.charts.map((chart) => ({
            ...chart,
            data: advanceData(chart.type, chart.data),
          })),
        })),
      );
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const addPanel = useCallback((name: string) => {
    const id = crypto.randomUUID();
    setPanels((current) => [...current, { id, name, charts: [] }]);
    setActivePanelId(id);
  }, []);

  const removePanel = useCallback((id: string) => {
    setPanels((current) => {
      const index = current.findIndex((panel) => panel.id === id);
      if (index === -1) return current;

      const next = current.filter((panel) => panel.id !== id);

      setActivePanelId((activeId) => {
        if (activeId !== id) return activeId;
        if (next.length === 0) return null;
        const neighborIndex = Math.min(index, next.length - 1);
        return next[neighborIndex]?.id ?? null;
      });

      return next;
    });
  }, []);

  const setActivePanel = useCallback((id: string) => {
    setActivePanelId(id);
  }, []);

  const addChart = useCallback((panelId: string, type: ChartType) => {
    const id = crypto.randomUUID();
    setPanels((current) =>
      current.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              charts: [
                ...panel.charts,
                {
                  id,
                  type,
                  title: CHART_TYPE_DEFAULT_TITLES[type],
                  data: createInitialData(type),
                },
              ],
            }
          : panel,
      ),
    );
  }, []);

  const removeChart = useCallback((panelId: string, chartId: string) => {
    setPanels((current) =>
      current.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              charts: panel.charts.filter((chart) => chart.id !== chartId),
            }
          : panel,
      ),
    );
  }, []);

  const resizeChart = useCallback(
    (panelId: string, chartId: string, size: ChartSize) => {
      setPanels((current) =>
        current.map((panel) =>
          panel.id === panelId
            ? {
                ...panel,
                charts: panel.charts.map((chart) =>
                  chart.id === chartId ? { ...chart, size } : chart,
                ),
              }
            : panel,
        ),
      );
    },
    [],
  );

  const togglePause = useCallback(() => {
    setPaused((current) => !current);
  }, []);

  const activePanel =
    panels.find((panel) => panel.id === activePanelId) ?? null;

  return {
    panels,
    activePanel,
    activePanelId,
    paused,
    hydrated,
    addPanel,
    removePanel,
    setActivePanel,
    addChart,
    removeChart,
    resizeChart,
    togglePause,
  };
}
