import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FrequencyTrackingIO — Political language intelligence",
  description:
    "Track what political figures are actually saying. Weekly briefings on phrase frequency, emerging narratives, and talking-point shifts.",
  openGraph: {
    title: "FrequencyTrackingIO",
    description: "Political language intelligence — track phrase frequency across Truth Social, White House, YouTube and news.",
    url: "https://frequencytrackingio.com",
    siteName: "FrequencyTrackingIO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6678675739964402"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6678675739964402"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
