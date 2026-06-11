import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teklifmatik | Profesyonel Teklif Oluşturucu",
  description: "Dakikalar içinde profesyonel fiyat teklifleri oluşturun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html
    lang="tr"
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  >
    <head>
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5047259451611337"
        crossOrigin="anonymous"
      />
    </head>

    <body className="min-h-full flex flex-col">
      {children}
    </body>
  </html>
);
}
