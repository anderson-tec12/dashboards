"use client";

import { useState } from "react";
import { ContainerTerminalModal } from "@/components/ContainerTerminalModal";
import {
  CONTAINER_STATUS_LABELS,
  type Container,
  type ContainerStatus,
} from "@/lib/containers/types";

type ContainerCardProps = {
  container: Container;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onPause: (id: string) => void;
};

const STATUS_STYLES: Record<ContainerStatus, string> = {
  running: "bg-emerald-500/15 text-emerald-400",
  paused: "bg-amber-500/15 text-amber-400",
  stopped: "bg-foreground/10 text-foreground/60",
};

export function ContainerCard({
  container,
  onStart,
  onStop,
  onPause,
}: ContainerCardProps) {
  const { id, name, image, status } = container;
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">{name}</h2>
          <p className="mt-1 font-mono text-sm text-foreground/60">{image}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
          {CONTAINER_STATUS_LABELS[status]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onStart(id)}
          disabled={status === "running"}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Iniciar
        </button>
        <button
          type="button"
          onClick={() => onStop(id)}
          disabled={status === "stopped"}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Parar
        </button>
        <button
          type="button"
          onClick={() => onPause(id)}
          disabled={status !== "running"}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pausar
        </button>
        <button
          type="button"
          onClick={() => setTerminalOpen(true)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:bg-foreground/5"
        >
          Terminal
        </button>
      </div>

      {terminalOpen ? (
        <ContainerTerminalModal
          container={container}
          onClose={() => setTerminalOpen(false)}
        />
      ) : null}
    </article>
  );
}
