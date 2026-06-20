import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";


export const metadata: Metadata = {
  title: "Software Development Company in Africa | SaaS & ERP Solutions | Sybella Systems",
  description: "Sybella Systems is a leading software development company in Africa specializing in SaaS platforms, custom ERP systems, and student job platforms. Creators of Ogera, a platform for student online jobs in Africa.",
  keywords: [
    "software development company Africa",
    "SaaS development Africa",
    "custom ERP systems",
    "student online jobs Africa",
    "software engineering Rwanda",
    "digital transformation Africa",
    "Ogera student jobs"
  ],
  openGraph: {
    title: "Software Development Company in Africa | Sybella Systems",
    description: "Leading software engineering company building SaaS platforms, ERP systems, and Ogera — Africa's student employment platform.",
    url: "https://sybellasystems.co.rw",
    type: "website",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Sybella Systems — Software Development Company in Africa"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Company in Africa | Sybella Systems",
    description: "SaaS platforms, ERP systems, and Ogera student jobs — premium software solutions across Africa.",
    images: ["/og-image.png"]
  }
};

export default function HomePage() {
  return <HomeClient />;
}
