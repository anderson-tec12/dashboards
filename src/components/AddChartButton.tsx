"use client";

import { useEffect, useRef, useState } from "react";
import type { ChartType } from "@/lib/charts/types";
import { CHART_TYPE_LABELS } from "@/lib/charts/types";

const CHART_TYPES = Object.keys(CHART_TYPE_LABELS) as ChartType[];

type AddChartButtonProps = {
  onAdd: (type: ChartType) => void;
  disabled?: boolean;
};

export function AddChartButton({
  onAdd,
  disabled = false,
}: AddChartButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Adicionar gráfico
      </button>

      {open && (
        <menu className="absolute right-0 z-10 mt-2 min-w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
          {CHART_TYPES.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() => {
                  onAdd(type);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-foreground/90 transition-colors hover:bg-foreground/5"
              >
                {CHART_TYPE_LABELS[type]}
              </button>
            </li>
          ))}
        </menu>
      )}
    </div>
  );
}
