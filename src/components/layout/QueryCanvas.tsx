"use client";

import React, { useState } from "react";
import { useQueryStore } from "@/hooks/useQueryStore";
import { generateSQL } from "@/utils/queryGenerators";
import { QueryGroup } from "@/components/builder/QueryGroup";

export const QueryCanvas: React.FC = () => {
  const { currentSchema, queryTree, resetQuery, addHistoryEntry } = useQueryStore();
  const [isRunning, setIsRunning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRunQuery = () => {
    setIsRunning(true);
    setSuccessMessage(null);

    // Simulate query execution delay
    setTimeout(() => {
      const sql = generateSQL(queryTree, currentSchema.id);
      const mockCount = Math.floor(Math.random() * 450) + 12; // Random count between 12 and 462
      
      addHistoryEntry(sql, mockCount);
      setIsRunning(false);
      setSuccessMessage(`Executed successfully! Returned ${mockCount} results.`);
      
      // Auto-hide success toast after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 600); // 600ms
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50/30 dark:bg-zinc-950/10 p-6 lg:p-8 overflow-y-auto">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/60 pb-5 dark:border-zinc-800/60 mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Query Builder
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Construct complex relational query branches visually on the <span className="font-semibold text-indigo-500 dark:text-indigo-400">{currentSchema.name}</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={resetQuery}
            type="button"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition"
          >
            Reset Builder
          </button>
          
          <button
            onClick={handleRunQuery}
            disabled={isRunning}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-50 dark:hover:bg-indigo-600 transition"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Run Query
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 transition-all duration-300 animate-fade-in">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Builder Workspace Layout */}
      <div className="flex-1 flex flex-col items-start justify-start p-6 sm:p-8 rounded-2xl border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-950/20 backdrop-blur-sm min-h-[350px] overflow-x-auto">
        <QueryGroup group={queryTree} />
      </div>
    </div>
  );
};
