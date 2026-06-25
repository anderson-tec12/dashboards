import type {
  ChartData,
  ChartType,
  PieSlice,
  ScatterPoint,
  TimeSeriesPoint,
} from "./types";

const WINDOW_SIZE = 30;
const PIE_CATEGORIES = [
  "Produto A",
  "Produto B",
  "Produto C",
  "Produto D",
  "Produto E",
];
const SCATTER_COUNT = 25;

function randomDelta(max = 10): number {
  return (Math.random() - 0.5) * max;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function createTimeSeriesPoints(
  count: number,
  baseValue = 50,
): TimeSeriesPoint[] {
  const now = Date.now();
  const points: TimeSeriesPoint[] = [];
  let value = baseValue;

  for (let i = count - 1; i >= 0; i -= 1) {
    value = clamp(value + randomDelta(8), 10, 200);
    points.push({
      time: formatTime(new Date(now - i * 1500)),
      value: Math.round(value * 10) / 10,
    });
  }

  return points;
}

function createPieSlices(): PieSlice[] {
  return PIE_CATEGORIES.map((name) => ({
    name,
    value: Math.round(20 + Math.random() * 80),
  }));
}

function createScatterPoints(): ScatterPoint[] {
  return Array.from({ length: SCATTER_COUNT }, () => [
    Math.round(Math.random() * 100),
    Math.round(Math.random() * 100),
  ]);
}

function isTimeSeriesType(type: ChartType): boolean {
  return type === "line" || type === "bar" || type === "area";
}

export function createInitialData(type: ChartType): ChartData {
  if (isTimeSeriesType(type)) {
    return { kind: "timeseries", points: createTimeSeriesPoints(WINDOW_SIZE) };
  }

  if (type === "pie") {
    return { kind: "pie", slices: createPieSlices() };
  }

  if (type === "gauge") {
    return { kind: "gauge", value: Math.round(30 + Math.random() * 40) };
  }

  return { kind: "scatter", points: createScatterPoints() };
}

function advanceTimeSeries(points: TimeSeriesPoint[]): TimeSeriesPoint[] {
  const lastValue = points.at(-1)?.value ?? 50;
  const nextValue = clamp(lastValue + randomDelta(12), 10, 200);

  const next: TimeSeriesPoint = {
    time: formatTime(new Date()),
    value: Math.round(nextValue * 10) / 10,
  };

  const updated = [...points, next];
  if (updated.length > WINDOW_SIZE) {
    updated.shift();
  }

  return updated;
}

function advancePieSlices(slices: PieSlice[]): PieSlice[] {
  return slices.map((slice) => ({
    ...slice,
    value: Math.max(5, Math.round(slice.value + randomDelta(15))),
  }));
}

function advanceGaugeValue(value: number): number {
  return Math.round(clamp(value + randomDelta(8), 0, 100));
}

function advanceScatterPoints(points: ScatterPoint[]): ScatterPoint[] {
  return points.map(([x, y]) => [
    clamp(Math.round(x + randomDelta(6)), 0, 100),
    clamp(Math.round(y + randomDelta(6)), 0, 100),
  ]);
}

export function advanceData(type: ChartType, prev: ChartData): ChartData {
  if (isTimeSeriesType(type) && prev.kind === "timeseries") {
    return { kind: "timeseries", points: advanceTimeSeries(prev.points) };
  }

  if (type === "pie" && prev.kind === "pie") {
    return { kind: "pie", slices: advancePieSlices(prev.slices) };
  }

  if (type === "gauge" && prev.kind === "gauge") {
    return { kind: "gauge", value: advanceGaugeValue(prev.value) };
  }

  if (type === "scatter" && prev.kind === "scatter") {
    return { kind: "scatter", points: advanceScatterPoints(prev.points) };
  }

  return createInitialData(type);
}
