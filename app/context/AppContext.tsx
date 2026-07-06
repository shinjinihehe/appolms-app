"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrlState] = useState<string>("");

  useEffect(() => {
    // Load base URL from localStorage on mount
    const savedUrl = localStorage.getItem("app_base_url");
    if (savedUrl) {
      setBaseUrlState(savedUrl.replace(/\/+$/, ""));
    } else {
      // Fallback default
      setBaseUrlState("https://api.example.com"); 
    }
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
