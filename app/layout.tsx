import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
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
    template: "%s | Sybella Systems – Software & SaaS in Africa" 
  },
  description: "Sybella Systems is Africa's leading software engineering company. We build custom ERP systems, SaaS platforms, and digital solutions across the continent. Creators of Ogera — Africa's premier student employment platform.",
  keywords: [
    "custom ERP developers Rwanda",
    "SaaS development Africa",
    "enterprise software Africa",
    "cloud solutions Lagos Nigeria",
    "mobile app development Kenya",
    "student employment platform Africa",
    "Ogera jobs platform",
    "software engineering Rwanda",
    "digital transformation Africa",
  ],
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
    description: "Africa-focused software development company engineering custom ERP systems, SaaS platforms, and enterprise solutions for Africa's leading companies. Creators of Ogera student employment platform.",
    images: [{ 
      url: "/og-image.png", 
      width: 1200, 
      height: 630, 
      alt: "Sybella Systems — Premium Software Engineering for Africa" 
    }],
  },
  twitter: { 
    card: "summary_large_image", 
    title: "Sybella Systems", 
    description: "Engineering Africa's digital future with premium software solutions.",
    images: ["/og-image.png"],
    creator: "@sybellasystems"
  },
  robots: { 
    index: true, 
    follow: true, 
    googleBot: { 
      index: true, 
      follow: true, 
      "max-video-preview": -1, 
      "max-image-preview": "large", 
      "max-snippet": -1 
    } 
  },
  icons: { 
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/logo.png"
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code-here", // Add your actual code
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
      </head>
      <body>
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
          <AppToaster />
        </Providers>
        <Analytics />
        

        {/* Organization Schema */}
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sybella Systems",
              "url": "https://sybellasystems.co.rw",
              "logo": "https://sybellasystems.co.rw/logo.png",
              "description": "Africa's leading software engineering company building custom ERP systems, SaaS platforms, and digital solutions.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "RW",
                "addressRegion": "Rulindo"
              },
              "sameAs": [
                "https://linkedin.com/company/sybella-systems",
                "https://twitter.com/sybellasystems"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "email": "hello@sybellasystems.co.rw"
              }
            })
          }}
          strategy="afterInteractive"
        />

        {/* Breadcrumb Schema */}
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://sybellasystems.co.rw"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Technology",
                  "item": "https://sybellasystems.co.rw/technology"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Ogera",
                  "item": "https://sybellasystems.co.rw/ogera"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Impact",
                  "item": "https://sybellasystems.co.rw/impact"
                }
              ]
            })
          }}
          strategy="afterInteractive"
        />

        {/* Company Schema */}
        <Script
          id="company-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Sybella Systems",
              "image": "https://sybellasystems.co.rw/logo.png",
              "url": "https://sybellasystems.co.rw",
              "telephone": "+250-XXX-XXX-XXX", // Add actual phone
              "email": "hello@sybellasystems.co.rw",
              "areaServed": {
                "@type": "Place",
                "name": "Africa"
              },
              "priceRange": "$$$"
            })
          }}
          strategy="afterInteractive"
        />

        {/* Google Analytics - Replace with your ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script
          id="ga-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `
          }}
        />
      </body>
    </html>
  );
}