import type { EChartsOption } from "echarts";
import type { ChartData, ChartType } from "./types";

const SERIES_COLOR = "#3b82f6";
const AREA_COLOR = "rgba(59, 130, 246, 0.25)";

function buildTimeSeriesOption(
  data: Extract<ChartData, { kind: "timeseries" }>,
  title: string,
  seriesType: "line" | "bar",
  area = false,
): EChartsOption {
  const times = data.points.map((p) => p.time);
  const values = data.points.map((p) => p.value);

  return {
    title: {
      text: title,
      left: 0,
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    xAxis: {
      type: "category",
      data: times,
      boundaryGap: seriesType === "bar",
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed" } },
    },
    series: [
      {
        type: seriesType,
        data: values,
        smooth: seriesType === "line",
        itemStyle: { color: SERIES_COLOR },
        ...(seriesType === "line" && {
          lineStyle: { width: 2, color: SERIES_COLOR },
          symbol: "circle",
          symbolSize: 6,
        }),
        ...(area && {
          areaStyle: { color: AREA_COLOR },
        }),
      },
    ],
  };
}

function buildPieOption(
  data: Extract<ChartData, { kind: "pie" }>,
  title: string,
): EChartsOption {
  return {
    title: {
      text: title,
      left: 0,
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      right: 0,
      top: "middle",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["40%", "55%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#131a26", borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: "bold" },
        },
        data: data.slices,
      },
    ],
  };
}

function buildGaugeOption(
  data: Extract<ChartData, { kind: "gauge" }>,
  title: string,
): EChartsOption {
  return {
    title: {
      text: title,
      left: 0,
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    series: [
      {
        type: "gauge",
        min: 0,
        max: 100,
        progress: { show: true, width: 12 },
        axisLine: { lineStyle: { width: 12 } },
        axisTick: { show: false },
        splitLine: { length: 8, lineStyle: { width: 2 } },
        axisLabel: { distance: 20 },
        pointer: { width: 5 },
        detail: {
          valueAnimation: true,
          fontSize: 24,
          offsetCenter: [0, "70%"],
          formatter: "{value}%",
        },
        data: [{ value: data.value }],
      },
    ],
  };
}

function buildScatterOption(
  data: Extract<ChartData, { kind: "scatter" }>,
  title: string,
): EChartsOption {
  return {
    title: {
      text: title,
      left: 0,
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    xAxis: { type: "value", splitLine: { lineStyle: { type: "dashed" } } },
    yAxis: { type: "value", splitLine: { lineStyle: { type: "dashed" } } },
    series: [
      {
        type: "scatter",
        symbolSize: 10,
        data: data.points,
        itemStyle: { color: SERIES_COLOR },
      },
    ],
  };
}

export function buildOption(
  type: ChartType,
  data: ChartData,
  title: string,
): EChartsOption {
  switch (type) {
    case "line":
      if (data.kind !== "timeseries") break;
      return buildTimeSeriesOption(data, title, "line");
    case "bar":
      if (data.kind !== "timeseries") break;
      return buildTimeSeriesOption(data, title, "bar");
    case "area":
      if (data.kind !== "timeseries") break;
      return buildTimeSeriesOption(data, title, "line", true);
    case "pie":
      if (data.kind !== "pie") break;
      return buildPieOption(data, title);
    case "gauge":
      if (data.kind !== "gauge") break;
      return buildGaugeOption(data, title);
    case "scatter":
      if (data.kind !== "scatter") break;
      return buildScatterOption(data, title);
  }

  throw new Error(`Tipo de gráfico incompatível: ${type}`);
}
