import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white/50 dark:border-zinc-900/80 dark:bg-zinc-950/50 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-500">
        <div>
          © {new Date().getFullYear()} QueryCraft. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-300">Features</a>
          <a href="/builder" className="hover:text-zinc-900 dark:hover:text-zinc-300">Workspace</a>
          <a href="https://github.com/Cr8tiveDav/query-builder" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-300">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
