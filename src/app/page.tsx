"use client";

import React from "react";
import { LandingNavbar } from "@/components/navigation/LandingNavbar";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { CtaBanner } from "@/components/homepage/CtaBanner";
import { Footer } from "@/components/navigation/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300 relative overflow-hidden flex flex-col pt-20">
      {/* Navigation Header */}
      <LandingNavbar />

      {/* Main Hero Section */}
      <main className="flex-1">
        <Hero />

        {/* Features Grid Section */}
        <Features />

        {/* CTA Bottom Banner */}
        <CtaBanner />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
