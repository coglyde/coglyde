import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coglyde",
  description: "A web design and digital marketing studio building sites that glide past the competition.",
  icons: {
    icon: "/coglyde-favicon.png",
  },
  openGraph: {
    title: "Coglyde",
    description: "Building sites that glide past the competition",
    url: "https://coglyde.com",
    siteName: "Coglyde",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Coglyde",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-black text-white">
        <ClerkProvider appearance={clerkAppearance} afterSignOutUrl="/">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
