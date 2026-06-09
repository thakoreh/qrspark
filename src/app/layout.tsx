import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QRSpark | Smart QR Campaigns for Local Businesses",
  description: "Turn print materials into trackable campaigns with dynamic QR codes, smart redirects, conversion pixels, and local-business analytics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: { title: "QRSpark", description: "Smart QR campaign analytics for restaurants, real estate, events, gyms, clinics, and local businesses", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable} noise min-h-[100dvh] antialiased`}><AppProviders>{children}<Toaster richColors position="top-right" /></AppProviders></body></html>;
}
