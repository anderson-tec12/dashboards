"use client";

import { AddChartButton } from "@/components/AddChartButton";
import { AppNav } from "@/components/AppNav";
import { ChartCard } from "@/components/ChartCard";
import { PanelTabs } from "@/components/PanelTabs";
import { usePanels } from "@/hooks/usePanels";

export default function TestesPage() {
  const {
    panels,
    activePanel,
    activePanelId,
    paused,
    hydrated,
    addPanel,
    removePanel,
    setActivePanel,
    addChart,
    removeChart,
    resizeChart,
    togglePause,
  } = usePanels();

  if (!hydrated) {
    return (
      <>
        <AppNav />
        <main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
          <header>
            <h1 className="text-2xl font-semibold">Testes</h1>
          </header>
        </main>
      </>
    );
  }

  return (
    <>
      <AppNav />
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Testes</h1>
              <p className="mt-1 text-sm text-foreground/70">
                Organize gráficos em painéis — crie, alterne e personalize cada
                conjunto
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePause}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/90 transition-colors hover:bg-foreground/5"
              >
                {paused ? "Retomar" : "Pausar"}
              </button>
              <AddChartButton
                onAdd={(type) => {
                  if (activePanelId) addChart(activePanelId, type);
                }}
                disabled={!activePanelId}
              />
            </div>
          </div>

          <PanelTabs
            panels={panels}
            activePanelId={activePanelId}
            onSelect={setActivePanel}
            onAdd={addPanel}
            onRemove={removePanel}
          />
        </header>

        {panels.length === 0 ? (
          <section className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12">
            <p className="text-center text-sm text-foreground/60">
              Nenhum painel criado. Clique em{" "}
              <span className="font-medium text-foreground/80">
                + Novo painel
              </span>{" "}
              para começar.
            </p>
          </section>
        ) : activePanel && activePanel.charts.length === 0 ? (
          <section className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12">
            <p className="text-center text-sm text-foreground/60">
              Nenhum gráfico em{" "}
              <span className="font-medium text-foreground/80">
                {activePanel.name}
              </span>
              . Clique em{" "}
              <span className="font-medium text-foreground/80">
                Adicionar gráfico
              </span>{" "}
              para começar.
            </p>
          </section>
        ) : (
          activePanel && (
            <section className="flex flex-wrap gap-6">
              {activePanel.charts.map((chart) => (
                <ChartCard
                  key={chart.id}
                  chart={chart}
                  onRemove={(chartId) => removeChart(activePanel.id, chartId)}
                  onResize={(chartId, size) =>
                    resizeChart(activePanel.id, chartId, size)
                  }
                />
              ))}
            </section>
          )
        )}
      </main>
    </>
  );
}
