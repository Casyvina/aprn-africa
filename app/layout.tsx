import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthProvider from "@/components/AuthProvider";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aprn-africa.org"),
  title: {
    default: "APRN — African Pipeline Resource Network",
    template: "%s | APRN Africa",
  },
  description:
    "Africa's leading pipeline engineering research organisation. Strategic intelligence, policy frameworks, training programmes, and infrastructure data for energy professionals across the continent.",
  keywords: [
    "African pipeline engineering",
    "pipeline research Africa",
    "energy infrastructure Africa",
    "pipeline training Nigeria",
    "APRN Africa",
    "African Pipeline Resource Network",
    "midstream Africa",
    "pipeline policy Africa",
    "energy transition Africa",
    "NMGP",
    "EACOP",
    "pipeline engineering courses",
  ],
  authors: [{ name: "APRN Africa", url: "https://aprn-africa.org" }],
  creator: "APRN Africa",
  publisher: "African Pipeline Resource Network",
  openGraph: {
    title: "APRN — African Pipeline Resource Network",
    description:
      "Africa's leading pipeline engineering research organisation. Strategic intelligence, policy frameworks, training programmes, and infrastructure data for energy professionals.",
    url: "https://aprn-africa.org",
    siteName: "African Pipeline Resource Network",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/hero-pipeline.jpg",
        width: 1200,
        height: 630,
        alt: "APRN Africa — African Pipeline Resource Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APRN — African Pipeline Resource Network",
    description:
      "Africa's leading pipeline engineering research organisation. Strategic intelligence, policy frameworks, training programmes, and infrastructure data.",
    images: ["/images/hero-pipeline.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AuthProvider>
          <PageTransition>{children}</PageTransition>
        </AuthProvider>
        <Script
          src="https://cdn.plot.ly/plotly-2.24.1.min.js"
          strategy="afterInteractive"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
