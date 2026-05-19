import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aprn-africa.org"),
  title: {
    default: "APRN — African Pipeline Resource Network",
    template: "%s | APRN",
  },
  description:
    "Research, engineering development, policy collaboration, and internationally aligned pipeline training to secure Africa's energy future.",
  openGraph: {
    title: "APRN — African Pipeline Resource Network",
    description:
      "Research, engineering development, policy collaboration, and internationally aligned pipeline training to secure Africa's energy future.",
    url: "https://aprn-africa.org",
    siteName: "African Pipeline Resource Network",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APRN — African Pipeline Resource Network",
    description:
      "Research, engineering development, policy collaboration, and internationally aligned pipeline training to secure Africa's energy future.",
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
        {children}
        <Script
          src="https://cdn.plot.ly/plotly-2.24.1.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
