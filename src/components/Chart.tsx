"use client";

import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { useEffect, useMemo, useRef } from "react";

const THEME_NAME = "dashboard-dark";

const SERIES_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

const FOREGROUND = "#e6edf3";
const MUTED = "#8b9cb3";
const BORDER = "#1f2a3a";

let themeRegistered = false;

function registerDashboardTheme() {
  if (themeRegistered) return;
  themeRegistered = true;

  echarts.registerTheme(THEME_NAME, {
    color: SERIES_COLORS,
    backgroundColor: "transparent",
    textStyle: {
      color: FOREGROUND,
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    },
    title: {
      textStyle: { color: FOREGROUND },
      subtextStyle: { color: MUTED },
    },
    legend: {
      textStyle: { color: MUTED },
    },
    tooltip: {
      backgroundColor: "#131a26",
      borderColor: BORDER,
      textStyle: { color: FOREGROUND },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: BORDER } },
      axisTick: { lineStyle: { color: BORDER } },
      axisLabel: { color: MUTED },
      splitLine: { lineStyle: { color: BORDER } },
    },
    valueAxis: {
      axisLine: { lineStyle: { color: BORDER } },
      axisTick: { lineStyle: { color: BORDER } },
      axisLabel: { color: MUTED },
      splitLine: { lineStyle: { color: BORDER } },
    },
    line: {
      itemStyle: { borderWidth: 2 },
      lineStyle: { width: 2 },
    },
    bar: {
      itemStyle: { borderRadius: [4, 4, 0, 0] },
    },
  });
}

registerDashboardTheme();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeOptions(
  base: EChartsOption,
  override: EChartsOption,
): EChartsOption {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];

    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = mergeOptions(
        existing as EChartsOption,
        value as EChartsOption,
      );
    } else {
      result[key] = value;
    }
  }

  return result as EChartsOption;
}

const DEFAULT_OPTIONS: EChartsOption = {
  textStyle: {
    color: FOREGROUND,
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  grid: {
    left: 16,
    right: 16,
    top: 48,
    bottom: 16,
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "#131a26",
    borderColor: BORDER,
    textStyle: { color: FOREGROUND },
  },
};

export type ChartProps = {
  option: EChartsOption;
  className?: string;
  style?: React.CSSProperties;
  height?: number | string;
  notMerge?: boolean;
};

export function Chart({
  option,
  className,
  style,
  height = 360,
  notMerge = true,
}: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReactECharts>(null);

  const mergedOption = useMemo(
    () => mergeOptions(DEFAULT_OPTIONS, option),
    [option],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frameId = 0;

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        chartRef.current?.getEchartsInstance().resize();
      });
    });

    observer.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height, ...style }}
    >
      <ReactECharts
        ref={chartRef}
        style={{ width: "100%", height: "100%" }}
        option={mergedOption}
        theme={THEME_NAME}
        opts={{ renderer: "canvas" }}
        notMerge={notMerge}
      />
    </div>
  );
}
