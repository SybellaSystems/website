import Nav from "@/components/Nav";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientWrapper from "./ClientWrapper";
import { AppToaster } from "@/components/Toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sybella Systems — Africa's Premium Software Company",
    template: "%s | Sybella Systems – Software & SaaS in Africa",
  },
  description:
    "Sybella Systems is Africa's leading software engineering company. We build custom ERP systems, SaaS platforms, and digital solutions across the continent.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.sybellasystems.co.rw"
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head />

      <body>
        <Providers>
          <ClientWrapper>
            {children}
          </ClientWrapper>

          <AppToaster />
        </Providers>

        <Script id="org-schema" type="application/ld+json" />
        <Script id="breadcrumb-schema" type="application/ld+json" />
        <Script id="company-schema" type="application/ld+json" />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />

        <Script id="ga-script" />
      </body>
    </html>
  );
}