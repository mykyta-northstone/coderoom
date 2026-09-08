import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://pairlet.dev";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-RMVP37GX3L";
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pairlet — Free Live Coding Interviews for JavaScript & TypeScript",
    template: "%s | Pairlet",
  },
  description:
    "Create a live coding room, share the link, and interview candidates in real time with Pairlet. Free for JavaScript & TypeScript. No candidate account required.",
  keywords: [
    "Pairlet",
    "pairlet.dev",
    "live coding interview",
    "JavaScript interview room",
    "TypeScript coding interview",
    "collaborative code editor",
    "online technical interview",
    "Yjs Monaco editor",
    "free live coding",
  ],
  authors: [{ name: "Pairlet" }],
  creator: "Pairlet",
  openGraph: {
    title: "Pairlet — Free Live Coding Interviews for JavaScript & TypeScript",
    description:
      "Create a live coding room, share the link, and interview candidates in real time. No candidate account required.",
    url: siteUrl,
    siteName: "Pairlet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pairlet — Free Live Coding Interviews for JavaScript & TypeScript",
    description:
      "Create a live coding room, share the link, and interview candidates in real time. No candidate account required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pairlet",
    url: siteUrl,
    description:
      "Free live coding interviews for JavaScript & TypeScript. Create a room, share the link, and interview candidates in real time.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en" className="h-full dark antialiased nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {umamiWebsiteId && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#121212] text-[#f4f4f4] nl">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
