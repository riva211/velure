"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Market = "IN" | "CA";

type MarketContextType = {
  market: Market;
  setMarket: (m: Market) => void;
  currencySymbol: string;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>("IN");
  const [initialized, setInitialized] = useState(false);
  const [needsSelection, setNeedsSelection] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem("velure_market")) as Market | null;
    if (saved === "IN" || saved === "CA") {
      setMarketState(saved);
    } else {
      setNeedsSelection(true);
    }
    setInitialized(true);
  }, []);

  const setMarket = (m: Market) => {
    setMarketState(m);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("velure_market", m);
      window.dispatchEvent(new Event("marketChanged"));
    }
    setNeedsSelection(false);
  };

  const currencySymbol = market === "IN" ? "₹" : "$";

  return (
    <MarketContext.Provider value={{ market, setMarket, currencySymbol }}>
      {initialized ? children : null}
      {initialized && (
        <Dialog open={needsSelection}>
          <DialogContent className="sm:max-w-md border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Welcome to Velure</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">Select your country to continue</p>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-amber-100 hover:border-amber-400 has-[:checked]:bg-amber-200/60 has-[:checked]:border-amber-500">
                <input
                  type="radio"
                  name="market"
                  checked={market === "IN"}
                  onChange={() => setMarket("IN")}
                  className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">India</div>
                  <div className="text-sm text-muted-foreground">Prices in ₹ (INR)</div>
                </div>
                <div className="text-2xl">🇮🇳</div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-amber-100 hover:border-amber-400 has-[:checked]:bg-amber-200/60 has-[:checked]:border-amber-500">
                <input
                  type="radio"
                  name="market"
                  checked={market === "CA"}
                  onChange={() => setMarket("CA")}
                  className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">Canada</div>
                  <div className="text-sm text-muted-foreground">Prices in $ (USD)</div>
                </div>
                <div className="text-2xl">🇨🇦</div>
              </label>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used within MarketProvider");
  return ctx;
}
