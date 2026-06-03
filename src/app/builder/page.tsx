import { AppShell } from "@/components/builder/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace | QueryCraft Visual Builder",
  description: "Construct queries visually and export in real-time to SQL, MongoDB, and GraphQL.",
};

export default function BuilderPage() {
  return <AppShell />;
}
