import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "Sybella Systems — Africa's Premium Software Company", template: "%s | Sybella Systems" },
  description: "Sybella Systems builds world-class software, custom ERP systems, and digital platforms across Africa. Creators of Ogera — the continent's premier student employment platform.",
  keywords: ["cloud solutions Rwanda", "custom ERP developers Lagos", "premium SaaS development Nairobi", "software company Africa", "Ogera student jobs Africa", "Sybella Systems Kigali"],
  authors: [{ name: "Sybella Systems", url: "https://sybellasystems.co.rw" }],
  creator: "Sybella Systems",
  publisher: "Sybella Systems",
  metadataBase: new URL("https://sybellasystems.co.rw"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sybellasystems.co.rw",
    siteName: "Sybella Systems",
    title: "Sybella Systems — Africa's Premium Software Company",
    description: "Engineering Africa's digital future. Custom software, SaaS platforms, and Ogera — connecting Africa's brightest students with opportunity.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sybella Systems" }],
  },
  twitter: { card: "summary_large_image", title: "Sybella Systems", description: "Engineering Africa's digital future.", images: ["/og-image.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/LOGO WITH NO BG.png", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sybella Systems",
          "url": "https://sybellasystems.co.rw",
          "logo": "https://sybellasystems.co.rw/logo.svg",
          "description": "Africa's premier software engineering company",
          "address": { "@type": "PostalAddress", "addressLocality": "Kigali", "addressCountry": "RW" },
          "sameAs": ["https://linkedin.com/company/sybella-systems", "https://twitter.com/sybellasystems"],
        }) }} />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
