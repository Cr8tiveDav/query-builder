"use client";

import React, { useState, useRef, useEffect } from "react";
import { QueryRule } from "@/types/query";
import { useQueryStore } from "@/hooks/useQueryStore";

interface RuleRowProps {
  rule: QueryRule;
  parentId: string;
}

export const RuleRow: React.FC<RuleRowProps> = ({ rule, parentId }) => {
  const { currentSchema, updateRule, removeNode } = useQueryStore();
  const [tagInput, setTagInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Track if drag started from the handle
  const isDraggingHandle = useRef(false);

  const fieldDef =
    currentSchema.fields.find((f) => f.name === rule.field) ||
    currentSchema.fields[0];

  // Safely cast or get default values for 'between'
  const minVal = rule.value?.min ?? "";
  const maxVal = rule.value?.max ?? "";
  const startVal = rule.value?.start ?? "";
  const endVal = rule.value?.end ?? "";

  // Reset dragover state globally when any drag operation ends
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragOver(false);
    };
    window.addEventListener("dragend", handleGlobalDragEnd);
    return () => window.removeEventListener("dragend", handleGlobalDragEnd);
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateRule(rule.id, { field: e.target.value });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateRule(rule.id, { operator: e.target.value });
  };

  const handleValueChange = (val: any) => {
    updateRule(rule.id, { value: val });
  };

  // Tag manager for 'in array' operator
  const tags: string[] = Array.isArray(rule.value) ? rule.value : [];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) {
        handleValueChange([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    handleValueChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggingHandle.current) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", rule.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    isDraggingHandle.current = false;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== rule.id) {
      const rootTree = useQueryStore.getState().queryTree;

      const findParentAndIndex = (
        group: typeof rootTree
      ): { parentId: string; index: number } | null => {
        const idx = group.children.findIndex((c) => c.id === rule.id);
        if (idx !== -1) {
          return { parentId: group.id, index: idx };
        }
        for (const child of group.children) {
          if (child.type === "group") {
            const res = findParentAndIndex(child);
            if (res) return res;
          }
        }
        return null;
      };

      const result = findParentAndIndex(rootTree);
      if (result) {
        useQueryStore.getState().moveNode(draggedId, result.parentId, result.index);
      }
    }
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl border border-zinc-200/50 bg-white/60 dark:border-zinc-800/40 dark:bg-zinc-900/10 shadow-sm transition group hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-800 ${
        isDragging ? "opacity-40" : ""
      } ${
        isDragOver
          ? "border-dashed border-2 border-indigo-500 bg-indigo-500/5 dark:border-indigo-500/80 dark:bg-indigo-500/10"
          : ""
      }`}
    >
      {/* Drag Handle */}
      <div
        onMouseDown={() => { isDraggingHandle.current = true; }}
        onMouseUp={() => { isDraggingHandle.current = false; }}
        className="drag-handle hidden sm:flex items-center text-zinc-300 dark:text-zinc-700 cursor-grab active:cursor-grabbing mr-1"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Field Dropdown */}
      <select
        value={rule.field}
        onChange={handleFieldChange}
        className="flex-1 min-w-[130px] h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
      >
        {currentSchema.fields.map((field) => (
          <option key={field.name} value={field.name}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator Dropdown */}
      <select
        value={rule.operator}
        onChange={handleOperatorChange}
        className="min-w-[110px] h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
      >
        {fieldDef.operators.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* Value Input Area */}
      <div className="flex-[2] flex items-center min-w-[200px]">
        {/* Boolean Value Type */}
        {fieldDef.type === "boolean" && (
          <label className="relative inline-flex items-center cursor-pointer select-none py-1">
            <input
              type="checkbox"
              checked={!!rule.value}
              onChange={(e) => handleValueChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:bg-zinc-400 dark:after:border-zinc-700 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
            <span className="ml-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
              {rule.value ? "TRUE" : "FALSE"}
            </span>
          </label>
        )}

        {/* Enum Value Type */}
        {fieldDef.type === "enum" && rule.operator !== "in array" && (
          <select
            value={rule.value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="" disabled>Select option</option>
            {fieldDef.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {/* Range Selector for Between Operator */}
        {rule.operator === "between" && (
          <div className="flex items-center gap-2 w-full">
            {fieldDef.type === "number" ? (
              <>
                <input
                  type="number"
                  placeholder="Min"
                  value={minVal}
                  onChange={(e) =>
                    handleValueChange({ min: e.target.value, max: maxVal })
                  }
                  className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                />
                <span className="text-[10px] font-bold text-zinc-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxVal}
                  onChange={(e) =>
                    handleValueChange({ min: minVal, max: e.target.value })
                  }
                  className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                />
              </>
            ) : (
              <>
                <input
                  type="date"
                  value={startVal}
                  onChange={(e) =>
                    handleValueChange({ start: e.target.value, end: endVal })
                  }
                  className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                />
                <span className="text-[10px] font-bold text-zinc-400">to</span>
                <input
                  type="date"
                  value={endVal}
                  onChange={(e) =>
                    handleValueChange({ start: startVal, end: e.target.value })
                  }
                  className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                />
              </>
            )}
          </div>
        )}

        {/* Array Tags Manager for In Array Operator */}
        {rule.operator === "in array" && (
          <div className="flex flex-wrap items-center gap-1.5 w-full min-h-[36px] rounded-lg border border-zinc-200 bg-white px-2 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900">
            {/* Tag Pills */}
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold px-2 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="text-zinc-400 hover:text-red-500 text-[9px] font-bold leading-none ml-0.5"
                >
                  &times;
                </button>
              </span>
            ))}
            
            {/* Input field */}
            <input
              type="text"
              placeholder={tags.length === 0 ? "Press Enter/comma for list" : ""}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 min-w-[80px] bg-transparent border-0 p-0 text-xs text-zinc-700 focus:outline-none focus:ring-0 dark:text-zinc-300 placeholder-zinc-400"
            />
          </div>
        )}

        {/* Standard input types (text, number, date) */}
        {fieldDef.type !== "boolean" && fieldDef.type !== "enum" && rule.operator !== "between" && rule.operator !== "in array" && (
          <input
            type={fieldDef.type === "number" ? "number" : fieldDef.type === "date" ? "date" : "text"}
            placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
            value={rule.value ?? ""}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          />
        )}
      </div>

      {/* Delete Rule Action */}
      <button
        onClick={() => removeNode(rule.id)}
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/60 bg-white text-zinc-400 hover:border-red-200 hover:text-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600 dark:hover:border-red-900/30 dark:hover:text-red-400 transition"
        aria-label="Delete Rule"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};
