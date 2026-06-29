"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookie } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/", label: "Containers" },
  { href: "/testes", label: "Testes" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAuthCookie();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-border bg-card/50 px-6 py-3 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent/15 text-foreground"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground/90"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground/90"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
