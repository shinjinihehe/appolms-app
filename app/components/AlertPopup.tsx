"use client";

import React, { useEffect } from "react";

interface AlertPopupProps {
  isOpen: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function AlertPopup({ isOpen, message, type = "info", onClose }: AlertPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500); // Auto close after 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-[#5851EF]/5 border-[#5851EF]/20 text-[#5851EF]",
  };

  const iconColors = {
    success: "text-green-500 bg-green-100",
    error: "text-red-500 bg-red-100",
    info: "text-[#5851EF] bg-[#5851EF]/10",
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[320px] px-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center p-3.5 rounded-2xl border shadow-lg backdrop-blur-md ${bgStyles[type]}`}>
        <div className={`p-1.5 rounded-full shrink-0 mr-3 ${iconColors[type]}`}>
          {type === "success" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          )}
          {type === "error" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          )}
          {type === "info" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          )}
        </div>
        <p className="text-xs font-semibold flex-1 leading-relaxed mr-2">{message}</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
}
