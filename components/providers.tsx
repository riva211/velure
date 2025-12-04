"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

import { MarketProvider } from "@/components/market-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MarketProvider>
        {children}
        <Toaster />
      </MarketProvider>
    </SessionProvider>
  );
}
