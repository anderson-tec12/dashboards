export type ChartType = "line" | "bar" | "area" | "pie" | "gauge" | "scatter";

export type TimeSeriesPoint = {
  time: string;
  value: number;
};

export type PieSlice = {
  name: string;
  value: number;
};

export type ScatterPoint = [number, number];

export type TimeSeriesData = {
  kind: "timeseries";
  points: TimeSeriesPoint[];
};

export type PieData = {
  kind: "pie";
  slices: PieSlice[];
};

export type GaugeData = {
  kind: "gauge";
  value: number;
};

export type ScatterData = {
  kind: "scatter";
  points: ScatterPoint[];
};

export type ChartData = TimeSeriesData | PieData | GaugeData | ScatterData;

export type ChartSize = {
  width: number;
  height: number;
};

export type ChartInstance = {
  id: string;
  type: ChartType;
  title: string;
  data: ChartData;
  size?: ChartSize;
};

export type Panel = {
  id: string;
  name: string;
  charts: ChartInstance[];
};

export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  line: "Linha",
  bar: "Barra",
  area: "Área",
  pie: "Pizza",
  gauge: "Medidor",
  scatter: "Dispersão",
};

export const CHART_TYPE_DEFAULT_TITLES: Record<ChartType, string> = {
  line: "Série temporal (linha)",
  bar: "Série temporal (barra)",
  area: "Série temporal (área)",
  pie: "Distribuição por categoria",
  gauge: "Indicador em tempo real",
  scatter: "Correlação X/Y",
};
