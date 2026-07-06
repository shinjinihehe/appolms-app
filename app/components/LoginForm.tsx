"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Input } from "./Input";
import Link from "next/link";

export default function LoginForm() {
  const [serverUrl, setServerUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
      alert("Please enter the Server URL.");
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
          router.push("/home");
          alert("Login Successful"); // Mimicking Fluttertoast
        } else {
          alert("Please verify your email before logging in.");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err: any) {
      alert(`An error occurred: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white h-full px-6 pt-10 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-semibold text-[#111111]">Log In</h1>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col">
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
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6 relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            )}
          </button>
        </div>

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

        <button 
          type="button" 
          onClick={() => router.push("/signup")}
          className="w-full text-[#757575] font-medium text-base py-4 rounded-2xl bg-white border border-[#E5E5E5] mb-12"
        >
          Register
        </button>

        <div className="text-center mb-8">
          <span className="text-[#757575] font-medium text-[15px]">Not have an account yet? </span>
          <Link href="/signup" className="text-[#5851EF] font-semibold text-[15px]">
            Sign Up
          </Link>
        </div>

        <div className="text-center flex flex-col space-y-4 pt-4">
          <Link href="/forgot-password" className="text-[#757575] font-medium text-[15px]">
            Forget password
          </Link>
        </div>
      </form>
    </div>
  );
}
