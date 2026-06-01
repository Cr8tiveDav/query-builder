import { AppShell } from "@/components/layout/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QueryCraft Visual Builder",
  description: "Construct queries visually and export in real-time to SQL, MongoDB, and GraphQL.",
};

export default function Home() {
  return <AppShell />;
}
