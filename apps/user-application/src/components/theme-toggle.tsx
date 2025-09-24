"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { ClientOnly } from "@tanstack/react-router";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ClientOnly>
      <div className="flex items-center gap-2">
        <Sun
          className={`h-4 w-4 transition-colors ${isDark ? "text-muted-foreground" : "text-foreground"}`}
        />
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          className="data-[state=checked]:bg-primary"
        />
        <Moon
          className={`h-4 w-4 transition-colors ${isDark ? "text-foreground" : "text-muted-foreground"}`}
        />
      </div>
    </ClientOnly>
  );
}
