"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { QueryCanvas } from "./QueryCanvas";
import { OutputPreview } from "./OutputPreview";

export const AppShell: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      {/* Top Header */}
      <Header />
      
      {/* Sidebar + Main Canvas Grid */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Hand Sidebar (Presets & History) */}
        <div className="glass-panel w-full lg:w-80 overflow-hidden shrink-0 flex flex-col">
          <Sidebar />
        </div>
        
        {/* Right Hand Editor Area (Canvas & Preview) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="glass-panel flex-1 flex flex-col overflow-hidden">
            <QueryCanvas />
          </div>
          <div className="glass-panel overflow-hidden">
            <OutputPreview />
          </div>
        </div>
      </div>
    </div>
  );
};
