import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/components/providers/root-providers";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "AgentPay — Agent-native treasury for Polkadot",
    template: "%s · AgentPay",
  },
  description:
    "Register AI agents, enforce spending policies, route yield across chains, and pay with deterministic splits and NFT receipts.",
  openGraph: {
    title: "AgentPay",
    description: "Treasury and payments built around your agents.",
    type: "website",
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
        className={`${sans.className} ${mono.variable} antialiased text-slate-100`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
