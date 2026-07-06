"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";

export default function ChangeServerUrlPage() {
  const router = useRouter();
  const { baseUrl, setBaseUrl } = useApp();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(baseUrl);
  }, [baseUrl]);

  const handleSave = () => {
    if (inputValue.trim()) {
      setBaseUrl(inputValue.trim());
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* App Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h1 className="text-xl text-[#273242] ml-2 font-medium">Change Server URL</h1>
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col">
        <h2 className="text-[#273242] font-bold text-[16px] mb-3">Server URL</h2>
        
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-[#F9F9F9] border border-[#E5E5E5] rounded-[16px] px-5 py-4 text-[16px] text-[#273242] outline-none focus:border-[#5851EF] transition-colors mb-3"
          placeholder="https://..."
        />
        
        <p className="text-[#757575] text-sm mb-8 font-medium">
          Current URL: {baseUrl}
        </p>
        
        <button 
          onClick={handleSave}
          className="w-full text-white font-medium text-[16px] py-4 rounded-2xl"
          style={{ background: 'linear-gradient(to right, #CC61FF 5%, #5851EF 88%)' }}
        >
          Save URL
        </button>
      </div>
    </div>
  );
}
