"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

const ITEMS = [
  { href: "/admin/projetos", label: "Projetos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/sobre", label: "Sobre" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-sm font-semibold text-foreground">Natália Machado · Admin</span>
          <nav className="flex items-center gap-5">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium",
                  pathname.startsWith(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}
