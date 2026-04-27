import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Sybella Systems — Engineering Africa's Digital Future",
  description: "Sybella Systems — Award-winning software engineering company in Africa. Custom ERP systems, SaaS development, and Ogera, Africa's leading student employment platform. Trusted by enterprise companies across Rwanda, Kenya, Nigeria, and beyond.",
  keywords: ["software engineering Africa", "custom ERP Rwanda", "SaaS development", "student employment platform"],
};

export default function HomePage() {
  return <HomeClient />;
}
