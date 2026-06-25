"use client";

import { useEffect, useMemo, useRef } from "react";
import { Chart } from "@/components/Chart";
import { buildOption } from "@/lib/charts/options";
import type { ChartInstance, ChartSize } from "@/lib/charts/types";

const DEFAULT_SIZE: ChartSize = { width: 520, height: 360 };

type ChartCardProps = {
  chart: ChartInstance;
  onRemove: (id: string) => void;
  onResize: (id: string, size: ChartSize) => void;
};

export function ChartCard({ chart, onRemove, onResize }: ChartCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const size = chart.size ?? DEFAULT_SIZE;

  const option = useMemo(
    () => buildOption(chart.type, chart.data, chart.title),
    [chart.type, chart.data, chart.title],
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let frameId = 0;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const { width, height } = entry.contentRect;
        const roundedWidth = Math.round(width);
        const roundedHeight = Math.round(height);

        if (roundedWidth === size.width && roundedHeight === size.height) {
          return;
        }

        onResize(chart.id, {
          width: roundedWidth,
          height: roundedHeight,
        });
      });
    });

    observer.observe(card);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [chart.id, onResize, size.width, size.height]);

  return (
    <article
      ref={cardRef}
      className="flex flex-col rounded-lg border border-border bg-card p-4 md:p-5"
      style={{
        resize: "both",
        overflow: "hidden",
        width: size.width,
        height: size.height,
        minWidth: 280,
        minHeight: 240,
      }}
    >
      <header className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground/90">
          {chart.title}
        </h2>
        <button
          type="button"
          onClick={() => onRemove(chart.id)}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground/70 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          aria-label={`Remover gráfico ${chart.title}`}
        >
          Remover
        </button>
      </header>
      <div className="min-h-0 flex-1">
        <Chart option={option} height="100%" notMerge={false} />
      </div>
    </article>
  );
}
