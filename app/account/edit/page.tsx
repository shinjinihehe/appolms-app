"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useAuth } from "../../../context/AuthContext";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 flex items-center">
        <button 
          onClick={() => router.back()}
          className="mr-4 text-[var(--color-text-dark)] p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--color-text-dark)]">Edit Profile</h1>
      </div>

      <div className="p-6 flex-1">
        <div className="flex justify-center mb-8 mt-4">
          <div className="relative">
            <div className="w-24 h-24 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {firstName.charAt(0) || "S"}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-[var(--color-primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <Input 
            label="First Name" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input 
            label="Last Name" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input 
            label="Email Address" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div className="mt-8">
            <Button type="submit" fullWidth>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
