import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QRForge | QR generator MVP with analytics demos",
  description: "Create branded QR codes, export PNG/SVG/PDF, preview analytics, and test Smart Redirect demo flows.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: { title: "QRForge", description: "QR code SaaS MVP with provider-ready billing, auth, and analytics scaffolds", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable} noise min-h-[100dvh] antialiased`}><AppProviders>{children}<Toaster richColors position="top-right" /></AppProviders></body></html>;
}
