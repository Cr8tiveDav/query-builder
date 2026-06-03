"use client";

import React from "react";
import { useQueryStore } from "@/hooks/useQueryStore";

export const Sidebar: React.FC = () => {
  const {
    currentSchema,
    presets,
    history,
    setSchema,
    loadQuery,
    clearHistory,
    deletePreset,
  } = useQueryStore();

  const handleLoadPreset = (preset: typeof presets[0]) => {
    // If different schema, switch it first
    if (preset.schemaId !== currentSchema.id) {
      setSchema(preset.schemaId);
    }
    // Load the query tree structure
    loadQuery(preset.queryTree);
  };

  const handleLoadHistory = (item: typeof history[0]) => {
    if (item.schemaId !== currentSchema.id) {
      setSchema(item.schemaId);
    }
    loadQuery(item.queryTree);
  };

  // Format timestamp to hh:mm:ss
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Filter presets for the active schema
  const activePresets = presets.filter(p => p.schemaId === currentSchema.id);

  return (
    <aside className="w-full shrink-0 border-b border-zinc-200/80 bg-zinc-50/50 p-6 dark:border-zinc-800/80 dark:bg-zinc-950/20 lg:w-80 lg:border-b-0 lg:border-r transition-all duration-300">
      <div className="flex flex-col gap-8 h-full">
        {/* Presets Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Query Presets
            </h2>
            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              {activePresets.length} Templates
            </span>
          </div>
          
          {activePresets.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              No presets saved for this schema.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {activePresets.map((preset) => {
                const isCustom = preset.id.startsWith("custom-preset-");
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className="group flex items-start justify-between rounded-xl border border-zinc-200/60 bg-white p-3 text-left shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:border-indigo-500/80 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                        {preset.name}
                      </span>
                      {preset.description && (
                        <span className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </span>
                      )}
                    </div>
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePreset(preset.id);
                        }}
                        type="button"
                        className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-500 dark:hover:text-red-400 transition-colors focus:outline-none shrink-0"
                        title="Delete custom preset"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="flex flex-col flex-1 min-h-[250px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Run History
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] font-medium text-red-500 hover:text-red-600 hover:underline dark:text-red-400 dark:hover:text-red-300"
              >
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col flex-1 items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-6 text-center dark:border-zinc-800">
              <svg
                className="h-8 w-8 text-zinc-300 dark:text-zinc-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                No queries run yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] lg:max-h-none lg:flex-1 pr-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLoadHistory(item)}
                  className="flex flex-col items-start rounded-xl border border-zinc-200/50 bg-white/60 p-3 text-left hover:bg-zinc-100/50 dark:border-zinc-800/50 dark:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-all duration-200"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="rounded bg-zinc-200/50 px-1 py-0.5 text-[9px] font-bold text-zinc-600 uppercase tracking-wide dark:bg-zinc-800 dark:text-zinc-400">
                      {item.schemaName.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <code className="mt-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 line-clamp-2 break-all w-full leading-normal">
                    {item.sql}
                  </code>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
