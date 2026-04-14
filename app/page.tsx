import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Sybella Systems — Engineering Africa's Digital Future",
  description: "Premium software engineering, SaaS development, and cloud solutions across Africa. Creators of Ogera — the continent's leading student employment platform.",
};

export default function HomePage() {
  return <HomeClient />;
}
