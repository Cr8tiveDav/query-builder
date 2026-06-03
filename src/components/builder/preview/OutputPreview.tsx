"use client";

import React, { useState } from "react";
import { useQueryStore } from "@/hooks/useQueryStore";
import { generateSQL, generateMongoDB, generateGraphQL } from "@/utils/queryGenerators";

type TabType = "sql" | "mongo" | "graphql";

// Custom SQL Syntax Tokenizer & Highlighter
export const highlightSQL = (line: string): React.ReactNode[] => {
  // Regex to capture:
  // 1. Strings: '(?:\\.|[^'\\])*'
  // 2. Backtick identifiers: `(?:\\.|[^`\\])*`
  // 3. Keywords: SELECT, FROM, WHERE, AND, OR, IN, BETWEEN, NOT, NULL, LIKE
  // 4. Numbers: \b\d+(?:\.\d+)?\b
  // 5. Operators: [=><!]+
  // 6. Whitespaces: \s+
  const sqlRegex = /('(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:SELECT|FROM|WHERE|AND|OR|IN|BETWEEN|NOT|NULL|LIKE)\b|\b\d+(?:\.\d+)?\b|[=><!]+|\s+)/gi;
  
  return line.split(sqlRegex).filter(Boolean).map((token, idx) => {
    const lowerToken = token.toLowerCase();
    
    if (token.startsWith("'") && token.endsWith("'")) {
      // String value
      return (
        <span key={idx} className="text-emerald-400">
          {token}
        </span>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      // Identifier (Fields/Table names)
      return (
        <span key={idx} className="text-sky-400 font-medium">
          {token}
        </span>
      );
    }
    if (["select", "from", "where", "and", "or", "in", "between", "not", "null", "like"].includes(lowerToken)) {
      // SQL Keywords
      return (
        <span key={idx} className="text-violet-400 font-bold">
          {token}
        </span>
      );
    }
    if (/^\d+(?:\.\d+)?$/.test(token)) {
      // Numbers
      return (
        <span key={idx} className="text-pink-400">
          {token}
        </span>
      );
    }
    if (/^[=><!]+$/.test(token)) {
      // Logical/Comparison operators
      return (
        <span key={idx} className="text-teal-400 font-semibold">
          {token}
        </span>
      );
    }
    // Default text/spaces
    return <span key={idx}>{token}</span>;
  });
};

// Custom JSON/GraphQL/MongoDB Syntax Tokenizer & Highlighter
export const highlightJSON = (line: string): React.ReactNode[] => {
  // Regex to capture:
  // 1. Double quoted strings: "(?:\\.|[^"\\])*"
  // 2. Numbers: \b\d+(?:\.\d+)?\b
  // 3. Booleans/Null: \b(?:true|false|null)\b
  // 4. Brackets / Syntax characters: [{}[\]:,]
  // 5. Whitespaces: \s+
  const jsonRegex = /("(?:\\.|[^"\\])*"|\b\d+(?:\.\d+)?\b|\b(?:true|false|null)\b|[{}[\]:,]|\s+)/g;
  const rawTokens = line.split(jsonRegex).filter(Boolean);
  
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    
    if (token.startsWith('"') && token.endsWith('"')) {
      // Determine if the string token is a JSON key by looking ahead for a colon ':'
      let isKey = false;
      for (let j = i + 1; j < rawTokens.length; j++) {
        if (/\s+/.test(rawTokens[j])) continue;
        if (rawTokens[j] === ':') {
          isKey = true;
        }
        break;
      }
      
      if (isKey) {
        const content = token.slice(1, -1);
        if (content.startsWith('$') || content.startsWith('_')) {
          // System/Operator keys starting with $ or _ (e.g., $and, _eq)
          nodes.push(
            <span key={i} className="text-violet-400 font-bold">
              {token}
            </span>
          );
        } else {
          // Standard JSON keys
          nodes.push(
            <span key={i} className="text-sky-400 font-semibold">
              {token}
            </span>
          );
        }
      } else {
        // String value
        nodes.push(
          <span key={i} className="text-emerald-400">
            {token}
          </span>
        );
      }
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      // Numbers
      nodes.push(
        <span key={i} className="text-pink-400">
          {token}
        </span>
      );
    } else if (["true", "false", "null"].includes(token)) {
      // Booleans/Null values
      nodes.push(
        <span key={i} className="text-teal-400 font-bold">
          {token}
        </span>
      );
    } else if (['{', '}', '[', ']'].includes(token)) {
      // Structure brackets
      nodes.push(
        <span key={i} className="text-zinc-500">
          {token}
        </span>
      );
    } else if (token === ':' || token === ',') {
      // Syntactic colons/commas
      nodes.push(
        <span key={i} className="text-zinc-500">
          {token}
        </span>
      );
    } else {
      // Default text
      nodes.push(<span key={i}>{token}</span>);
    }
  }
  return nodes;
};

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

  const queryContent = getQueryContent();
  const lines = queryContent.split("\n");

  const highlightLine = (line: string, lang: TabType): React.ReactNode => {
    if (lang === "sql") {
      return highlightSQL(line);
    }
    return highlightJSON(line);
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition cursor-pointer"
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

      {/* Code Display Area with Line Numbers */}
      <div className="p-6 overflow-x-auto max-h-72 bg-zinc-950 border border-zinc-900 rounded-b-2xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="flex font-mono text-xs leading-relaxed select-none">
          {/* Line Numbers Gutter */}
          <div className="pr-4 text-zinc-600 text-right border-r border-zinc-800/40 min-w-[2.25rem] select-none">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code Lines Column */}
          <div className="pl-4 select-text overflow-x-auto w-full text-zinc-100 whitespace-pre">
            {lines.map((line, i) => (
              <div key={i} className="min-h-[1.5rem] hover:bg-zinc-900/40 px-1 rounded transition-colors">
                {highlightLine(line, activeTab)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
