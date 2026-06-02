"use client";

import React, { useState, useRef, useEffect } from "react";
import { QueryGroup as QueryGroupType } from "@/types/query";
import { useQueryStore } from "@/hooks/useQueryStore";
import { RuleRow } from "./RuleRow";

interface QueryGroupProps {
  group: QueryGroupType;
  depth?: number;
}

export const QueryGroup: React.FC<QueryGroupProps> = ({ group, depth = 0 }) => {
  const {
    updateGroupConjunction,
    toggleGroupCollapse,
    addRule,
    addGroup,
    removeNode,
  } = useQueryStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Track if drag started from the handle
  const isDraggingHandle = useRef(false);

  const isRoot = group.id === "root";
  const isCollapsed = !!group.isCollapsed;

  // Determine colors based on depth to visually distinguish nesting
  const borderColors = [
    "border-l-indigo-500 dark:border-l-indigo-500",
    "border-l-purple-500 dark:border-l-purple-500",
    "border-l-teal-500 dark:border-l-teal-500",
    "border-l-pink-500 dark:border-l-pink-500",
  ];
  const borderAccent = borderColors[depth % borderColors.length];

  // Reset dragover state globally when any drag operation ends
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragOver(false);
    };
    window.addEventListener("dragend", handleGlobalDragEnd);
    return () => window.removeEventListener("dragend", handleGlobalDragEnd);
  }, []);

  // Drag and Drop handlers for logical groups
  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggingHandle.current) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", group.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    isDraggingHandle.current = false;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== group.id) {
      useQueryStore.getState().moveNode(draggedId, group.id, group.children.length);
    }
  };

  return (
    <div
      draggable={!isRoot}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-4 border-l-2 ${borderAccent} pl-4 sm:pl-6 py-2 w-full transition-all duration-300 ${
        isDragging ? "opacity-40" : ""
      } ${
        isDragOver
          ? "border-dashed border-l-2 border-indigo-500 bg-indigo-500/5 dark:border-l-indigo-500/80 dark:bg-indigo-500/10 rounded-xl"
          : ""
      }`}
    >
      {/* Group Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/40 pb-3 dark:border-zinc-800/30">
        <div className="flex items-center gap-3">
          {/* Drag Handle for Subgroups (Hidden for root group) */}
          {!isRoot && (
            <div
              onMouseDown={() => { isDraggingHandle.current = true; }}
              onMouseUp={() => { isDraggingHandle.current = false; }}
              className="drag-handle flex items-center text-zinc-300 dark:text-zinc-700 cursor-grab active:cursor-grabbing"
              title="Drag Group"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => toggleGroupCollapse(group.id)}
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={isCollapsed ? "Expand Group" : "Collapse Group"}
          >
            <svg
              className={`h-3.5 w-3.5 transform transition-transform duration-200 ${
                isCollapsed ? "-rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Conjunction Selector (AND / OR) */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/55 p-0.5 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-inner">
            <button
              onClick={() => updateGroupConjunction(group.id, "AND")}
              type="button"
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                group.conjunction === "AND"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              AND
            </button>
            <button
              onClick={() => updateGroupConjunction(group.id, "OR")}
              type="button"
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                group.conjunction === "OR"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              OR
            </button>
          </div>
          
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Group Level {depth + 1}
          </span>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => addRule(group.id)}
            type="button"
            className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-[10px] font-bold text-zinc-700 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Rule
          </button>

          <button
            onClick={() => addGroup(group.id)}
            type="button"
            className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-[10px] font-bold text-zinc-700 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Group
          </button>

          {/* Delete Group button (disabled for root) */}
          {!isRoot && (
            <button
              onClick={() => removeNode(group.id)}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/60 bg-white text-zinc-400 hover:border-red-200 hover:text-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600 dark:hover:border-red-900/30 dark:hover:text-red-400 transition"
              aria-label="Delete Group"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Group Children Nodes */}
      {!isCollapsed && (
        <div className="flex flex-col gap-4 mt-2">
          {group.children.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-950/10">
              <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                Empty Group logic. Click "Add Rule" or "Add Group" to build query criteria.
              </span>
            </div>
          ) : (
            group.children.map((child) => {
              if (child.type === "group") {
                return (
                  <QueryGroup
                    key={child.id}
                    group={child}
                    depth={depth + 1}
                  />
                );
              } else {
                return (
                  <RuleRow
                    key={child.id}
                    rule={child}
                    parentId={group.id}
                  />
                );
              }
            })
          )}
        </div>
      )}
    </div>
  );
};
