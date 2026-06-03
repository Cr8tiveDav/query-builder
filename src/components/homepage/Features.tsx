import React from "react";

export const Features: React.FC = () => {
  return (
    <section id="features" className="w-full px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-zinc-900/80">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4272FF]">
            Feature Set
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
            A serious query surface, shaped for developers.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Ditch writing raw queries. QueryCraft helps users construct deeply nested logical conditions visually, generating optimized syntaxes instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Recursive UI Engineering",
              desc: "Nest groups, toggle conjunctions, and build complex logic trees recursively with zero structural constraints.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
              )
            },
            {
              title: "Live Syntax Compiler",
              desc: "Real-time query code generation. Supports SQL WHERE commands, MongoDB JSON parameters, and GraphQL schemas.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              )
            },
            {
              title: "Schema-Driven System",
              desc: "UI elements adapt dynamically based on your fields. Renders date pickers, numbers, enums, and boolean logic automatically.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
              )
            },
            {
              title: "Execution Simulator",
              desc: "Run active canvas queries against structured datasets. Review matches on a paginated grid with column sorting.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )
            },
            {
              title: "JSON Serialization",
              desc: "Export canvas groups to local JSON files and import them later. Structures undergo strict schema-matching checks.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              )
            },
            {
              title: "Keyboard Navigation",
              desc: "Construct queries rapidly with hotkeys like Cmd+Enter to execute queries and Escape to dismiss modal panels.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
              )
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel p-6 hover:scale-[1.01] hover:border-[#4272FF]/40 hover:shadow-md hover:shadow-[#4272FF]/5 transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4272FF]/10 text-[#4272FF] mb-5">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
