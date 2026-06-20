import type { Metadata } from "next";
import TechnologyClient from "./TechnologyClient";

export const metadata: Metadata = {
  title: "Technology Services | Sybella Systems",
  description: "Explore Sybella Systems technology services: custom ERP platforms, SaaS product engineering, web and mobile development, and cloud delivery support for African enterprises.",
  keywords: ["custom ERP Africa", "SaaS engineering", "enterprise software development", "cloud delivery"],
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}