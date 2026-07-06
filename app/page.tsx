"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the server-url setting page after 3 seconds
    const timer = setTimeout(() => {
      const savedUrl = localStorage.getItem("server_url");
      if (!savedUrl) {
        router.push("/server-url");
      } else {
        router.push("/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center">
      <div className="w-48 h-48 mb-8 relative">
        <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
        </div>
      </div>
      
      <h1 className="text-white text-3xl font-bold tracking-tight mb-2">LMS Academy</h1>
      <p className="text-white/80 font-medium">Learning Management System</p>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
