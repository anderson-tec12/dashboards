"use client";

import { AppNav } from "@/components/AppNav";
import { ContainerCard } from "@/components/ContainerCard";
import { useContainers } from "@/hooks/useContainers";

export default function Home() {
  const {
    containers,
    hydrated,
    startContainer,
    stopContainer,
    pauseContainer,
  } = useContainers();

  if (!hydrated) {
    return (
      <>
        <AppNav />
        <main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
          <header>
            <h1 className="text-2xl font-semibold">Containers</h1>
          </header>
        </main>
      </>
    );
  }

  return (
    <>
      <AppNav />
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
        <header>
          <h1 className="text-2xl font-semibold">Containers</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Gerencie containers locais — inicie, pare ou pause cada serviço
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {containers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              onStart={startContainer}
              onStop={stopContainer}
              onPause={pauseContainer}
            />
          ))}
        </section>
      </main>
    </>
  );
}
