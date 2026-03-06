import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VERTICAL LEISURE - Background Music for Important Waiting",
  description: "Background Music for Important Waiting - An elevator music experience. Stream all 15 tracks from the VERTICAL LEISURE album.",
  keywords: ["VERTICAL LEISURE", "elevator music", "ambient", "lounge", "background music", "album stream"],
  authors: [{ name: "VERTICAL LEISURE" }],
  icons: {
    icon: "/favicon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#8b7355",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VERTICAL LEISURE",
  },
  openGraph: {
    title: "VERTICAL LEISURE",
    description: "Background Music for Important Waiting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VERTICAL LEISURE",
    description: "Background Music for Important Waiting",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
