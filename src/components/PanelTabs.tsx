"use client";

import { useEffect, useRef, useState } from "react";
import type { Panel } from "@/lib/charts/types";

type PanelTabsProps = {
  panels: Panel[];
  activePanelId: string | null;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
};

export function PanelTabs({
  panels,
  activePanelId,
  onSelect,
  onAdd,
  onRemove,
}: PanelTabsProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setNewName("");
    setCreating(false);
  }

  function handleCancel() {
    setNewName("");
    setCreating(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {panels.map((panel) => {
        const isActive = panel.id === activePanelId;

        return (
          <div key={panel.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onSelect(panel.id)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-accent bg-accent/15 text-foreground"
                  : "border-border text-foreground/70 hover:bg-foreground/5 hover:text-foreground/90"
              }`}
            >
              {panel.name}
            </button>
            {isActive && (
              <button
                type="button"
                onClick={() => onRemove(panel.id)}
                className="ml-1 rounded-md px-1.5 py-1 text-xs text-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label={`Excluir painel ${panel.name}`}
              >
                ×
              </button>
            )}
          </div>
        );
      })}

      {creating ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleCreate();
              if (event.key === "Escape") handleCancel();
            }}
            placeholder="Nome do painel"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Criar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground/80"
        >
          + Novo painel
        </button>
      )}
    </div>
  );
}
