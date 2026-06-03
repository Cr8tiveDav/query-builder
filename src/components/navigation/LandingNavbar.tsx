"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export const LandingNavbar: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="w-full h-16 border border-zinc-200/80 dark:border-[#27272A] bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md rounded-2xl transition-all duration-300">
          <div className="h-full flex items-center justify-between px-6">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-[#4272FF] shadow-md shadow-indigo-500/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                  QueryCraft
                </span>
                <span className="text-[9px] font-extrabold tracking-wider text-[#4272FF] dark:text-[#4272FF] uppercase mt-1">
                  VISUAL BUILDER
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                Features
              </a>
              <a href="#mockup" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                Interactive Preview
              </a>
              <a
                href="https://github.com/Cr8tiveDav/query-builder"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Documentation
              </a>
            </nav>

            {/* Action Area */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm hover:bg-zinc-50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                aria-label="Toggle Theme"
              >
                {currentTheme === "light" ? (
                  // Moon Icon
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  // Sun Icon
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                )}
              </button>

              {/* Launch CTA */}
              <Link
                href="/builder"
                className="hidden sm:inline-flex h-9 px-5 items-center justify-center rounded-lg text-xs font-bold text-white bg-[#4272FF] hover:bg-[#2554E0] shadow-md shadow-[#4272FF]/10 transition-colors"
              >
                Open builder
              </Link>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};
