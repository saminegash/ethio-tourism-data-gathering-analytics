"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 bg-surface-secondary border border-border-primary rounded-xl p-1.5 shadow-sm transition-all duration-200">
      <button
        onClick={() => setTheme("light")}
        className={`group relative p-3 rounded-lg transition-all duration-200 ${
          theme === "light"
            ? "bg-surface-primary text-primary-600 shadow-soft scale-105"
            : "text-gray-500 hover:text-primary-500 hover:bg-surface-primary/50"
        }`}
        title="Light theme"
        aria-label="Switch to light theme"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {theme === "light" && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        )}
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`group relative p-3 rounded-lg transition-all duration-200 ${
          theme === "dark"
            ? "bg-surface-primary text-primary-600 shadow-soft scale-105"
            : "text-gray-500 hover:text-primary-500 hover:bg-surface-primary/50"
        }`}
        title="Dark theme"
        aria-label="Switch to dark theme"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:-rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        {theme === "dark" && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* <button
        onClick={() => setTheme("system")}
        className={`group relative p-3 rounded-lg transition-all duration-200 ${
          theme === "system"
            ? "bg-surface-primary text-primary-600 shadow-soft scale-105"
            : "text-gray-500 hover:text-primary-500 hover:bg-surface-primary/50"
        }`}
        title="System theme"
        aria-label="Use system theme preference"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        {theme === "system" && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        )}
      </button> */}
    </div>
  );
}
