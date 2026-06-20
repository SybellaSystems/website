import type { Metadata } from "next";
import ImpactClient from "@/app/impact/ImpactClient";

export const metadata: Metadata = {
  title: "Impact & Mission | Sybella Systems — Engineering Africa's Future",
  description: "Learn how Sybella Systems is building world-class software infrastructure across Africa. Founded in Rwanda, serving 5+ African markets. Mission, values, and contact information.",
};

export default function ImpactPage() {
  return <ImpactClient />;
}
