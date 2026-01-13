"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const initial: Theme = saved === "light" || saved === "dark" ? saved : getSystemTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2v2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20v2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.93 4.93l1.41 1.41"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.66 17.66l1.41 1.41"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 12h2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 12h2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.93 19.07l1.41-1.41"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.66 6.34l1.41-1.41"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      )}
    </button>
  );
}
