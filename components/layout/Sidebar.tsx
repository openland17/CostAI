"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Upload,
  Building2,
} from "lucide-react";
import { useProject } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Document", icon: Upload },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { projects } = useProject();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-border bg-[#0A0C10]">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-4.5 w-4.5 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Cost<span className="text-primary">AI</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="pb-1 pt-6">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Projects
          </p>
        </div>

        {projects.map((project) => {
          const isActive = pathname === `/project/${project.id}`;
          return (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <FolderKanban className="h-4 w-4 shrink-0" />
              <span className="truncate">{project.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="text-[11px] text-muted-foreground/50">
          CostAI v0.1 — Engage Group
        </p>
      </div>
    </aside>
  );
}
