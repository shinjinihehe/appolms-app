"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/Input";
import { useApp } from "../../context/AppContext";

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
    <div className="min-h-screen bg-white flex flex-col pt-12 px-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-[#5851EF]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#111111]">Sign Up</h1>
        </div>

        {/* Login / Signup toggle pill */}
        <div className="bg-[#F5F5FA] p-1 rounded-full flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-full text-sm font-semibold text-[#757575] hover:text-[#111111] transition-all duration-200"
          >
            Log In
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-[#5851EF] text-white shadow-md transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col flex-1">
        {/* Your organization Section */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-bold text-[#111111] px-1">Your organization</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#5851EF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <input
              type="url"
              placeholder="https://appolms.com"
              value={serverUrl}
              onChange={(e) => {
                setServerUrl(e.target.value);
                setBaseUrl(e.target.value);
              }}
              className="w-full bg-white border-2 border-[#D3C9FC] focus:border-[#5851EF] rounded-[18px] py-4 pl-12 pr-12 outline-none transition-all duration-200 placeholder-gray-400 text-[15px] font-medium text-[#111111]"
              required
            />
            {serverUrl && serverUrl.startsWith("http") && (
              <div className="absolute right-4 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
            )}
          </div>
          <span className="text-[12px] text-[#757575] font-medium px-1">Enter your organization's URL to continue</span>
        </div>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="mx-4 text-sm text-gray-400 font-medium">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Registration details Section */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-bold text-[#111111] px-1">Registration details</label>
          <div className="border border-gray-200 rounded-[20px] overflow-hidden bg-white">
            {/* Name Input */}
            <div className="relative flex items-center border-b border-gray-200 bg-white">
              <div className="absolute left-4 text-[#5851EF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-[15px] text-[#111111] placeholder-gray-400 font-medium"
                required
              />
            </div>
            {/* Email Input */}
            <div className="relative flex items-center border-b border-gray-200 bg-white">
              <div className="absolute left-4 text-[#5851EF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-[15px] text-[#111111] placeholder-gray-400 font-medium"
                required
              />
            </div>
            {/* Password Input */}
            <div className="relative flex items-center border-b border-gray-200 bg-white">
              <div className="absolute left-4 text-[#5851EF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-[15px] text-[#111111] placeholder-gray-400 font-medium"
                required
              />
            </div>
            {/* Confirm Password Input */}
            <div className="relative flex items-center bg-white">
              <div className="absolute left-4 text-[#5851EF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-[15px] text-[#111111] placeholder-gray-400 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-[25px] p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
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
  );
}
