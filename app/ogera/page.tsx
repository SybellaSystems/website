import type { Metadata } from "next";
import OgeraClient from "@/app/ogera/OgeraClient";

export const metadata: Metadata = {
  title: "Ogera — Africa's Student Employment Platform | Sybella Systems",
  description: "Ogera connects Africa's university students with vetted job opportunities, internships, and career growth. Verified profiles, AI matching, and compliance-ready hiring for enterprises.",
};

export default function OgeraPage() {
  return <OgeraClient />;
}
