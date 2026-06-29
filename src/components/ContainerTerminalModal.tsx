"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { runMockCommand, type TerminalEntry } from "@/lib/containers/terminal";
import type { Container } from "@/lib/containers/types";

type ContainerTerminalModalProps = {
  container: Container;
  onClose: () => void;
};

function createEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ContainerTerminalModal({
  container,
  onClose,
}: ContainerTerminalModalProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const scrollToBottom = useCallback(() => {
    const history = historyRef.current;
    if (!history) return;

    history.scrollTop = history.scrollHeight;
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const command = input.trim();
      if (!command) return;

      const output = runMockCommand(command, container);

      setEntries((current) => [
        ...current,
        {
          id: createEntryId(),
          command,
          output,
        },
      ]);
      setInput("");
      requestAnimationFrame(scrollToBottom);
    },
    [container, input, scrollToBottom],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Fechar terminal"
      />
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terminal-title"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 id="terminal-title" className="text-base font-medium">
              Terminal — {container.name}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-foreground/60">
              {container.image}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-2.5 py-1 text-sm text-foreground/80 transition-colors hover:bg-foreground/5"
            aria-label="Fechar terminal"
          >
            Fechar
          </button>
        </header>

        <div
          ref={historyRef}
          className="min-h-64 max-h-96 overflow-y-auto bg-black/40 px-4 py-3 font-mono text-sm"
        >
          {entries.length === 0 ? (
            <p className="text-foreground/50">
              Digite um comando e pressione Enter.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="mb-3 last:mb-0">
                <p className="text-emerald-400">$ {entry.command}</p>
                {entry.output ? (
                  <pre className="mt-1 whitespace-pre-wrap text-foreground/80">
                    {entry.output}
                  </pre>
                ) : null}
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border px-4 py-3"
        >
          <span className="font-mono text-sm text-emerald-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite um comando..."
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-foreground/40"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
