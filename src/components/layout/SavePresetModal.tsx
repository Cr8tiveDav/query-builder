"use client";

import React, { useState } from "react";
import { useQueryStore } from "@/hooks/useQueryStore";

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({ isOpen, onClose }) => {
  const { saveAsPreset } = useQueryStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Preset name is required");
      return;
    }
    
    saveAsPreset(name.trim(), description.trim());
    
    // Reset form fields
    setName("");
    setDescription("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/40 pb-3 dark:border-zinc-800/40">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Save Query Preset
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400 text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="preset-name"
              className="text-xs font-semibold text-zinc-500 dark:text-zinc-400"
            >
              Preset Name *
            </label>
            <input
              id="preset-name"
              type="text"
              placeholder="e.g. My Custom Query"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="h-10 rounded-lg border border-zinc-200 bg-transparent px-3 py-1 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:text-zinc-200 dark:focus:border-indigo-500"
            />
            {error && (
              <span className="text-[10px] font-bold text-red-500 dark:text-red-400">
                {error}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="preset-desc"
              className="text-xs font-semibold text-zinc-500 dark:text-zinc-400"
            >
              Description
            </label>
            <textarea
              id="preset-desc"
              placeholder="Brief summary of what this template queries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:text-zinc-200 dark:focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200/40 pt-4 dark:border-zinc-800/40">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
            >
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
