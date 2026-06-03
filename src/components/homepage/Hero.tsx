"use client";

import React from "react";
import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-3xl border border-zinc-200/80 dark:border-[#27272A] bg-zinc-50/50 dark:bg-zinc-950/20 p-8 md:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

            {/* Left Hero Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4272FF]/10 text-[#4272FF] border border-[#4272FF]/20 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4272FF] animate-pulse" />
                Visual query builder
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
                Design recursive queries with <span className="text-[#4272FF]">visual precision</span>.
              </h1>

              {/* Subheading */}
              <p className="text-md leading-relaxed text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl">
                Construct advanced logical filters with drag-and-drop hierarchy. Generate compliant SQL, MongoDB, and GraphQL queries on the fly with real-time dry-runs.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/builder"
                  className="inline-flex h-11 px-6 items-center justify-center rounded-xl text-sm font-bold text-white bg-[#4272FF] hover:bg-[#2554E0] shadow-lg shadow-[#4272FF]/15 hover:shadow-[#4272FF]/25 hover:scale-[1.01] active:scale-[0.99] transition"
                >
                  Launch builder
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-11 px-6 items-center justify-center rounded-xl text-sm font-bold border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition"
                >
                  Explore features
                </a>
              </div>

            </div>

            {/* Right Hero Column: Builder & Code Workstation Mockup */}
            <div id="mockup" className="lg:col-span-7 w-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#4272FF]/5 dark:bg-[#4272FF]/10 blur-3xl rounded-3xl pointer-events-none" />

              {/* Main Workspace window mockup */}
              <div className="w-full max-w-2xl border border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
                {/* Browser bar */}
                <div className="flex h-11 items-center justify-between border-b border-zinc-200/80 bg-zinc-100/50 px-4 dark:border-zinc-800/80 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="h-6 w-72 rounded bg-zinc-200/50 px-3 text-[10px] font-semibold text-zinc-400 dark:bg-zinc-900/60 dark:text-zinc-500 flex items-center justify-center font-mono">
                    POST /api/v1/query/execute
                  </div>
                  <div className="w-10" />
                </div>

                {/* Split panels container */}
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
                  {/* Left panel: Visual builder mockup */}
                  <div className="md:col-span-6 p-5 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4">
                      Visual Builder
                    </span>

                    <div className="space-y-4">
                      {/* Level 1 parent Group */}
                      <div className="border-l-2 border-[#4272FF] pl-3 py-1 space-y-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#4272FF]/10 text-[#4272FF] uppercase">
                            AND
                          </span>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                            Group Level 1
                          </span>
                        </div>

                        {/* Rule 1 */}
                        <div className="flex items-center justify-between rounded-lg border border-zinc-200/60 bg-white p-2.5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">age</span>
                            <span className="text-[10px] text-zinc-400 font-mono">&gt;=</span>
                            <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/40 dark:border-zinc-700/50">18</span>
                          </div>
                        </div>

                        {/* Nested Group Level 2 */}
                        <div className="border-l-2 border-purple-500 pl-3 py-1 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 uppercase">
                              OR
                            </span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                              Group Level 2
                            </span>
                          </div>

                          {/* Nested Rule A */}
                          <div className="flex items-center justify-between rounded-lg border border-zinc-200/60 bg-white p-2 dark:border-zinc-800/60 dark:bg-zinc-900/40">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">country</span>
                              <span className="text-[9px] text-zinc-400 font-mono">==</span>
                              <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/40 dark:border-zinc-700/50">"Canada"</span>
                            </div>
                          </div>

                          {/* Nested Rule B */}
                          <div className="flex items-center justify-between rounded-lg border border-zinc-200/60 bg-white p-2 dark:border-zinc-800/60 dark:bg-zinc-900/40">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">country</span>
                              <span className="text-[9px] text-zinc-400 font-mono">==</span>
                              <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/40 dark:border-zinc-700/50">"Nigeria"</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Add Buttons */}
                      <div className="pt-2">
                        <button type="button" className="text-[10px] font-bold text-[#4272FF] hover:underline cursor-default flex items-center gap-1">
                          <span>+</span> Add rule or nested group
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right panel: Syntax-highlighted code output mockup */}
                  <div className="md:col-span-6 p-5 bg-zinc-950 border-t md:border-t-0 border-zinc-900 text-zinc-300 font-mono text-[11px] leading-relaxed flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-4 font-sans font-semibold">
                        Generated SQL Query
                      </span>

                      <div className="space-y-2 mt-4 font-mono text-[11px] text-zinc-300">
                        <div>
                          <span className="text-violet-400 font-bold">SELECT</span> <span className="text-teal-400 font-semibold">*</span> <span className="text-violet-400 font-bold">FROM</span> <span className="text-sky-400 font-medium">`users`</span>
                        </div>
                        <div>
                          <span className="text-violet-400 font-bold">WHERE</span> <span className="text-sky-400 font-medium">`age`</span> <span className="text-teal-400 font-semibold">&gt;=</span> <span className="text-pink-400">18</span>
                        </div>
                        <div className="pl-3">
                          <span className="text-violet-400 font-bold">AND</span> (
                        </div>
                        <div className="pl-6">
                          <span className="text-sky-400 font-medium">`country`</span> <span className="text-teal-400 font-semibold">=</span> <span className="text-emerald-400">"Canada"</span>
                        </div>
                        <div className="pl-3">
                          <span className="text-violet-400 font-bold">OR</span>
                        </div>
                        <div className="pl-6">
                          <span className="text-sky-400 font-medium">`country`</span> <span className="text-teal-400 font-semibold">=</span> <span className="text-emerald-400">"Nigeria"</span>
                        </div>
                        <div className="pl-3">)</div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-3 mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-sans">
                      <span>Syntax: SQL Query</span>
                      <span className="text-[#4272FF]">Copied!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
