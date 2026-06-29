export type ContainerStatus = "running" | "paused" | "stopped";

export type Container = {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
};

export const CONTAINER_STATUS_LABELS: Record<ContainerStatus, string> = {
  running: "Em execução",
  paused: "Pausado",
  stopped: "Parado",
};
