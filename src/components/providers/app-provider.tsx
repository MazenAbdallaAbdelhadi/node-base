"use client";
import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "./theme-provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextTopLoader color="var(--primary)" showSpinner={false} />
      {children}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};
