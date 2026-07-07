"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrlState] = useState<string>("");
  // We can't safely use useRouter here if it's the root layout, but this is a provider. 
  // Let's just leave it empty and let the individual pages handle it, or we can use window.location
  
  useEffect(() => {
    const savedUrl = localStorage.getItem("app_base_url");
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
    const origin = window.location.origin;

    // If saved URL is stale localhost but we're running elsewhere, ignore it
    const isStale = savedUrl && savedUrl.includes("localhost") && !origin.includes("localhost");
    // Also ignore Vercel deployment URLs saved from previous web-only loads
    const isVercel = savedUrl && savedUrl.includes("vercel.app");

    if (savedUrl && !isStale && !isVercel) {
      setBaseUrlState(savedUrl.replace(/\/+$/, ""));
    } else if (envUrl) {
      setBaseUrlState(envUrl);
    }
    // Otherwise leave empty — user will enter their org URL on login
  }, []);

  const setBaseUrl = (url: string) => {
    // Strip trailing slashes to prevent //api issues
    const cleanUrl = url.replace(/\/+$/, "");
    setBaseUrlState(cleanUrl);
    localStorage.setItem("app_base_url", cleanUrl);
  };

  return (
    <AppContext.Provider value={{ baseUrl, setBaseUrl }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
