import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider } from "jotai";

import { AppProvider } from "@/components/providers";

import { TRPCReactProvider } from "@/trpc/client";

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
  title: "Node base",
  description: "Create your workflows with Node base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>
              <AppProvider>{children}</AppProvider>
            </Provider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
