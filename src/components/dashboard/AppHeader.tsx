"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Moon, Plus, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: "date" | "score" | "variations";
  onSortChange: (value: "date" | "score" | "variations") => void;
  onNewExperiment: () => void;
  onExportAll: () => void;
}

export function AppHeader({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onNewExperiment,
  onExportAll,
}: AppHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/experiments", label: "Experiments" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md dark:bg-background/80 dark:border-white/8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-display text-sm font-medium">LL</span>
            </div>
            <div>
              <h1 className="font-display text-lg leading-none">LLM Lab</h1>
              <p className="text-xs text-muted-foreground">
                Parameter sweep and response analysis
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 dark:bg-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-foreground hover:text-background dark:hover:bg-white/10 dark:hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:max-w-2xl lg:justify-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prompts..."
              className="pl-9"
            />
          </div>

          <Select value={sortBy} onValueChange={(v) => onSortChange(v as typeof sortBy)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Newest first</SelectItem>
              <SelectItem value="score">Best score</SelectItem>
              <SelectItem value="variations">Most variants</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onExportAll}>
            <Download className="size-4" />
            Export
          </Button>
          <Button size="sm" onClick={onNewExperiment}>
            <Plus className="size-4" />
            New run
          </Button>
        </div>
      </div>
    </header>
  );
}
