"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../components/Input";
import { useApp } from "../context/AppContext";

export default function SignupPage() {
  const router = useRouter();
  const { baseUrl, setBaseUrl } = useApp();

  const [serverUrl, setServerUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (baseUrl) {
      setServerUrl(baseUrl);
    }
  }, [baseUrl]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!serverUrl.trim()) {
      setError("Please enter the Server URL");
      return;
    }

    const cleanUrl = serverUrl.trim().replace(/\/+$/, "");
    setBaseUrl(cleanUrl);

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${cleanUrl}/api/signup?type=registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      if (response.status === 201 || response.ok) {
        // Registration successful
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-12">
      {/* Header */}
      <div className="flex items-center px-4 py-4 mb-4">
        <button 
          onClick={() => router.back()} 
          className="w-[45px] h-[45px] border border-gray-200 rounded-[14px] flex items-center justify-center bg-white shadow-sm ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#273242" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full mx-auto px-6">
        
        <div className="mt-8 mb-10 text-center">
          <h1 className="text-[28px] font-semibold text-[#111111]">Sign Up</h1>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col flex-1">
          <div className="mb-[15px]">
            <Input 
              type="url" 
              placeholder="Server URL (e.g. https://appolms.com)" 
              value={serverUrl}
              onChange={(e) => {
                setServerUrl(e.target.value);
                setBaseUrl(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-[15px]">
            <Input 
              type="text" 
              placeholder="Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-[15px]">
            <Input 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-[15px]">
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-[25px]">
            <Input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-[15px] p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="w-full">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full text-white font-medium text-base py-4 rounded-2xl relative overflow-hidden flex justify-center border border-gray-100 disabled:opacity-70"
              style={{
                background: 'linear-gradient(to right, #CC61FF 5%, #5851EF 88%)'
              }}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
