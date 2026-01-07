import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReputaAI | AI-Powered Reputation Management for SMBs",
  description: "Automate your review management, generate AI responses, and boost your business reputation across all platforms with ReputaAI.",
  keywords: ["reputation management", "AI review response", "SMB tools", "business reviews", "Google My Business", "Yelp management"],
  authors: [{ name: "ReputaAI Team" }],
  openGraph: {
    title: "ReputaAI | AI-Powered Reputation Management",
    description: "The ultimate tool for small businesses to manage and grow their online reputation.",
    type: "website",
  },
};

import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
