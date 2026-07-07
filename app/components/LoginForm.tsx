"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { AlertPopup } from "./AlertPopup";
import Link from "next/link";

export default function LoginForm() {
  const [serverUrl, setServerUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setAlertState({ isOpen: true, message, type });
  };
  
  const { login } = useAuth();
  const { baseUrl, setBaseUrl } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (baseUrl) {
      setServerUrl(baseUrl);
    }
  }, [baseUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUrl.trim()) {
      showAlert("Please enter the Server URL.", "error");
      return;
    }
    if (!email.trim()) {
      showAlert("Please enter your email.", "error");
      return;
    }
    if (!password.trim()) {
      showAlert("Please enter your password.", "error");
      return;
    }
    
    // Save the server URL and sanitize
    const cleanUrl = serverUrl.trim().replace(/\/+$/, "");
    setBaseUrl(cleanUrl);
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${cleanUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password
        }).toString()
      });

      const data = await response.json();

      if (response.status === 201) {
        if (data.user?.email_verified_at) {
          login(data.token, data.user);
          showAlert("Login Successful", "success");
          setTimeout(() => {
            router.push("/home");
          }, 1000);
        } else {
          showAlert("Please verify your email before logging in.", "info");
        }
      } else {
        showAlert(data.message || "Login failed", "error");
      }
    } catch (err: any) {
      showAlert(`An error occurred: ${err.message || err}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white h-full px-6 pt-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-[#5851EF]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#111111]">Log In</h1>
        </div>

        {/* Login / Signup toggle pill */}
        <div className="bg-[#F5F5FA] p-1 rounded-full flex items-center shadow-inner">
          <button
            type="button"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-[#5851EF] text-white shadow-md transition-all duration-200"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="px-5 py-2 rounded-full text-sm font-semibold text-[#757575] hover:text-[#111111] transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} noValidate className="flex flex-col">
        {/* Your organization Section */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-bold text-[#111111] px-1">Your organization</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#5851EF]">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 20.8543C5.56417 20.8543 1.14584 16.436 1.14584 11.0002C1.14584 5.56433 5.56417 1.146 11 1.146C16.4358 1.146 20.8542 5.56433 20.8542 11.0002C20.8542 16.436 16.4358 20.8543 11 20.8543ZM11 2.521C6.325 2.521 2.52084 6.32516 2.52084 11.0002C2.52084 15.6752 6.325 19.4793 11 19.4793C15.675 19.4793 19.4792 15.6752 19.4792 11.0002C19.4792 6.32516 15.675 2.521 11 2.521Z" fill="currentColor"/>
                <path d="M8.25 19.9376H7.33333C6.9575 19.9376 6.64583 19.626 6.64583 19.2501C6.64583 18.8743 6.93917 18.5718 7.315 18.5626C5.87583 13.6493 5.87583 8.35096 7.315 3.43762C6.93917 3.42846 6.64583 3.12596 6.64583 2.75012C6.64583 2.37429 6.9575 2.06262 7.33333 2.06262H8.25C8.47 2.06262 8.68083 2.17262 8.80917 2.34679C8.9375 2.53012 8.97417 2.75929 8.90083 2.97012C7.1775 8.14929 7.1775 13.851 8.90083 19.0393C8.97417 19.2501 8.9375 19.4793 8.80917 19.6626C8.68083 19.8276 8.47 19.9376 8.25 19.9376Z" fill="currentColor"/>
                <path d="M13.75 19.9376C13.6767 19.9376 13.6033 19.9284 13.53 19.9009C13.1725 19.7817 12.9708 19.3876 13.0992 19.0301C14.8225 13.8509 14.8225 8.14925 13.0992 2.96092C12.98 2.60342 13.1725 2.20925 13.53 2.09008C13.8967 1.97092 14.2817 2.16342 14.4008 2.52092C16.225 7.98425 16.225 13.9976 14.4008 19.4517C14.3092 19.7542 14.0342 19.9376 13.75 19.9376Z" fill="currentColor"/>
                <path d="M11 15.7668C8.4425 15.7668 5.89417 15.4093 3.4375 14.6851C3.42833 15.0518 3.12583 15.3543 2.75 15.3543C2.37417 15.3543 2.0625 15.0426 2.0625 14.6668V13.7501C2.0625 13.5301 2.1725 13.3193 2.34667 13.1909C2.53 13.0626 2.75917 13.0259 2.97 13.0993C8.14917 14.8226 13.86 14.8226 19.0392 13.0993C19.25 13.0259 19.4792 13.0626 19.6625 13.1909C19.8458 13.3193 19.9467 13.5301 19.9467 13.7501V14.6668C19.9467 15.0426 19.635 15.3543 19.2592 15.3543C18.8833 15.3543 18.5808 15.0609 18.5717 14.6851C16.1058 15.4093 13.5575 15.7668 11 15.7668Z" fill="currentColor"/>
                <path d="M19.25 8.93766C19.1767 8.93766 19.1033 8.92849 19.03 8.90099C13.8508 7.17766 8.14 7.17766 2.96084 8.90099C2.59417 9.02016 2.20917 8.82766 2.09 8.47016C1.98 8.10349 2.1725 7.71849 2.53 7.59933C7.99334 5.77516 14.0067 5.77516 19.4608 7.59933C19.8183 7.71849 20.02 8.11266 19.8917 8.47016C19.8092 8.75433 19.5342 8.93766 19.25 8.93766Z" fill="currentColor"/>
              </svg>
            </div>
            <input
              type="url"
              placeholder="https://example.com"
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

        {/* Login details Section */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-bold text-[#111111] px-1">Login details</label>
          <div className="border border-gray-200 rounded-[20px] overflow-hidden bg-white">
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
            <div className="relative flex items-center bg-white">
              <div className="absolute left-4 text-[#5851EF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-12 outline-none text-[15px] text-[#111111] placeholder-gray-400 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end mb-8 px-1">
          <Link href="/forgot-password" className="text-[#5851EF] font-semibold text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center p-4 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5851EF]"></div>
            </div>
          ) : (
            <button 
              type="submit" 
              className="w-full text-white font-medium text-base py-4 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(to right, #CC61FF 5%, #5851EF 88%)' }}
            >
              Log In
            </button>
          )}
        </div>
      </form>
      <AlertPopup isOpen={alertState.isOpen} message={alertState.message} type={alertState.type} onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
