import type { Container } from "./types";

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: "c1",
    name: "nginx-web",
    image: "nginx:1.25-alpine",
    status: "running",
  },
  {
    id: "c2",
    name: "postgres-db",
    image: "postgres:16-alpine",
    status: "stopped",
  },
  {
    id: "c3",
    name: "redis-cache",
    image: "redis:7-alpine",
    status: "paused",
  },
  {
    id: "c4",
    name: "api-backend",
    image: "node:22-alpine",
    status: "running",
  },
];
