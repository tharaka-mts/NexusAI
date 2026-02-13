"use client";

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative group">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="h-9 w-9 p-0 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max -translate-x-1/2 rounded-md border border-border/60 bg-card/80 px-2 py-1 text-[11px] text-muted-foreground opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100">
        {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      </div>
    </div>
  );
};
