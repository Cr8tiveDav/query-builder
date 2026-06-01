"use client";

import React, { useState } from "react";
import { useQueryStore } from "@/hooks/useQueryStore";
import { generateSQL, generateMongoDB, generateGraphQL } from "@/utils/queryGenerators";

type TabType = "sql" | "mongo" | "graphql";

export const OutputPreview: React.FC = () => {
  const { queryTree, currentSchema } = useQueryStore();
  const [activeTab, setActiveTab] = useState<TabType>("sql");
  const [copied, setCopied] = useState(false);

  // Generate query strings in real time
  const sqlQuery = generateSQL(queryTree, currentSchema.id);
  const mongoQuery = generateMongoDB(queryTree, currentSchema.id);
  const graphqlQuery = generateGraphQL(queryTree, currentSchema.id);

  const getQueryContent = () => {
    switch (activeTab) {
      case "mongo":
        return mongoQuery;
      case "graphql":
        return graphqlQuery;
      case "sql":
      default:
        return sqlQuery;
    }
  };

  const getQueryLanguage = () => {
    switch (activeTab) {
      case "mongo":
        return "JSON / MongoDB";
      case "graphql":
        return "GraphQL";
      case "sql":
      default:
        return "SQL";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getQueryContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="w-full border-t border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 py-3 gap-3">
        {/* Output Tabs */}
        <div className="flex items-center gap-1.5">
          {(["sql", "mongo", "graphql"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === tab
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {tab.toUpperCase()} Output
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Format: {getQueryLanguage()}
          </span>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-6 overflow-x-auto max-h-60 bg-zinc-900/5 dark:bg-zinc-950/50">
        <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed select-all">
          {getQueryContent()}
        </pre>
      </div>
    </div>
  );
};
