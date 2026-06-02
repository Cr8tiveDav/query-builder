"use client";

import React, { useState, useEffect } from "react";
import { useQueryStore } from "@/hooks/useQueryStore";
import { generateSQL } from "@/utils/queryGenerators";
import { QueryGroup } from "@/components/builder/QueryGroup";
import { SavePresetModal } from "./SavePresetModal";
import { validateQueryTree } from "@/utils/queryValidator";
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_LOGS } from "@/utils/mockData";
import { evaluateQuery } from "@/utils/queryEvaluator";

export const QueryCanvas: React.FC = () => {
  const { currentSchema, queryTree, resetQuery, addHistoryEntry } = useQueryStore();
  const [isRunning, setIsRunning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Query Execution States
  const [results, setResults] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Reset execution state on schema changes
  useEffect(() => {
    setResults(null);
    setCurrentPage(1);
    setSortField(null);
    setSortOrder("asc");
  }, [currentSchema.id]);

  // Compute validation state reactively
  const validationErrors = validateQueryTree(queryTree, currentSchema.id);
  const isValid = Object.keys(validationErrors).length === 0;

  const handleRunQuery = () => {
    setIsRunning(true);
    setSuccessMessage(null);
    setResults(null);

    // Select the correct mock dataset
    let dataset: any[] = [];
    if (currentSchema.id === "users") {
      dataset = MOCK_USERS;
    } else if (currentSchema.id === "products") {
      dataset = MOCK_PRODUCTS;
    } else if (currentSchema.id === "logs") {
      dataset = MOCK_LOGS;
    }

    setTimeout(() => {
      const sql = generateSQL(queryTree, currentSchema.id);
      const filtered = evaluateQuery(queryTree, dataset);
      
      setResults(filtered);
      addHistoryEntry(sql, filtered.length);
      setIsRunning(false);
      setSuccessMessage(`Executed successfully! Returned ${filtered.length} matching records.`);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 500);
  };

  // Derived columns from currentSchema
  const columns = currentSchema.fields.map((f) => ({
    name: f.name,
    label: f.label,
  }));

  const getSortedResults = () => {
    if (!results) return [];
    if (!sortField) return results;

    return [...results].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortOrder === "asc"
          ? aVal === bVal
            ? 0
            : aVal
            ? 1
            : -1
          : aVal === bVal
          ? 0
          : bVal
          ? 1
          : -1;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  };

  const sortedResults = getSortedResults();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleHeaderClick = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
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
            onClick={() => isValid && setIsSaveModalOpen(true)}
            disabled={!isValid}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition"
            title={!isValid ? "Resolve validation errors before saving preset" : "Save preset"}
          >
            <svg className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Save Preset
          </button>

          <button
            onClick={resetQuery}
            type="button"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition"
          >
            Reset Builder
          </button>
          
          <button
            onClick={handleRunQuery}
            disabled={isRunning || !isValid}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-600 dark:hover:bg-indigo-700 transition"
            title={!isValid ? "Resolve validation errors before running query" : "Execute query"}
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
      <div className="flex flex-col items-start justify-start p-6 sm:p-8 rounded-2xl border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-950/20 backdrop-blur-sm min-h-[350px] overflow-x-auto">
        <QueryGroup group={queryTree} />
      </div>

      {/* Loading state during execution */}
      {isRunning && (
        <div className="mt-8 flex flex-col items-center justify-center p-12 rounded-2xl border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-950/20 backdrop-blur-sm transition-all duration-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-xs font-semibold text-zinc-500 mt-4 animate-pulse">Filtering dataset records...</span>
        </div>
      )}

      {/* Query Results Simulator Grid */}
      {!isRunning && results !== null && (
        <div className="mt-8 flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-950/20 backdrop-blur-sm transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-200/40 pb-3 dark:border-zinc-800/40">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Execution Results
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Inspect matching database records evaluated in real-time.
              </p>
            </div>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400">
              {results.length} Matches Found
            </span>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="mt-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">No Records Match Query</h4>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-[280px]">
                Try adjusting operators, lessening nesting constraints, or entering general criteria values.
              </p>
            </div>
          ) : (
            <>
              {/* Results Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/70 border-b border-zinc-200/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider dark:bg-zinc-900/50 dark:border-zinc-800/50">
                      {columns.map((col) => (
                        <th
                          key={col.name}
                          onClick={() => handleHeaderClick(col.name)}
                          className="px-4 py-3 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 select-none transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            {col.label}
                            {sortField === col.name && (
                              <span className="text-[8px] text-indigo-500 dark:text-indigo-400">
                                {sortOrder === "asc" ? "▲" : "▼"}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/30 text-xs">
                    {paginatedResults.map((record, index) => (
                      <tr key={record.id || index} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/5 transition-colors">
                        {columns.map((col) => {
                          const val = record[col.name];
                          let rendered = String(val ?? "");
                          if (typeof val === "boolean") {
                            rendered = val ? "TRUE" : "FALSE";
                          }
                          return (
                            <td key={col.name} className="px-4 py-2.5 font-medium text-zinc-700 dark:text-zinc-300">
                              {rendered}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-200/40 pt-4 dark:border-zinc-800/40">
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                    Showing {Math.min(results.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(results.length, currentPage * itemsPerPage)} of {results.length} rows
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
                    >
                      Prev
                    </button>
                    
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <SavePresetModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} />
    </div>
  );
};
