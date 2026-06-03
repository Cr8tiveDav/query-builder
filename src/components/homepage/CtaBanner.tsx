import React from "react";
import Link from "next/link";

export const CtaBanner: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4 relative">
            Build your first query visual tree today.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto mb-8 relative">
            No configurations, no API setups. Select from mock datasets, design filters, and check outputs in real-time.
          </p>
          <Link
            href="/builder"
            className="inline-flex h-11 px-8 items-center justify-center rounded-xl text-sm font-bold text-white bg-[#4272FF] hover:bg-[#2554E0] shadow-lg shadow-[#4272FF]/20 relative hover:scale-[1.01] transition"
          >
            Open Builder Workstation
          </Link>
        </div>
      </div>
    </section>
  );
};
