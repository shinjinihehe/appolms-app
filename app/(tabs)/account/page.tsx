"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/LoginForm";
import { LogoutModal } from "../../components/LogoutModal";

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.push("/home");
  };

  const accountLinks = [
    { title: "Edit Profile", href: "/edit-profile", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    ) },
    { title: "My Wishlists", href: "/my-wishlists", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    ) },
    { title: "Change Password", href: "/change-password", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path><circle cx="16.5" cy="7.5" r=".5"></circle></svg>
    ) },
    { title: "Delete Your Account", href: "/delete-account", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
    ) },
    { title: "Log Out", onClick: () => setIsLogoutModalOpen(true), icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    ) },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24 bg-[var(--color-background)]">
      <div className="flex justify-end px-6 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full border border-gray-200 bg-white flex items-center justify-center mb-4 shadow-sm relative overflow-hidden">
           {user?.photo ? (
             <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
             </div>
           )}
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text-dark)]">{user?.name || "Demo Student"}</h1>
        <p className="text-[var(--color-text-grey)] text-sm font-medium mt-1">{user?.phone || "No Phone number"}</p>
      </div>

      <div className="flex flex-col w-full">
        {accountLinks.map((link, index) => (
          <React.Fragment key={index}>
            {link.href ? (
              <Link href={link.href} className="flex items-center px-6 py-4 bg-white active:bg-gray-50 transition-colors">
                <div className="w-6 h-6 flex items-center justify-center mr-4">
                  {link.icon}
                </div>
                <span className="font-bold text-[15px] text-[var(--color-text-dark)] flex-1">{link.title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
            ) : (
              <button onClick={link.onClick} className="flex items-center w-full px-6 py-4 bg-white active:bg-gray-50 transition-colors text-left">
                <div className="w-6 h-6 flex items-center justify-center mr-4">
                  {link.icon}
                </div>
                <span className="font-bold text-[15px] text-[var(--color-text-dark)] flex-1">{link.title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            )}
            <div className="px-6 bg-white">
              <div className="border-b border-gray-200"></div>
            </div>
          </React.Fragment>
        ))}
        
        {/* About Section */}
        <div className="flex items-center px-6 py-4 bg-white text-left">
          <div className="w-6 h-6 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12" stroke="white" strokeWidth="2"></line><line x1="12" y1="8" x2="12.01" y2="8" stroke="white" strokeWidth="2"></line></svg>
          </div>
          <div className="flex-1 flex flex-col">
            <span className="font-bold text-[15px] text-[var(--color-text-dark)] mb-0.5">About</span>
            <span className="text-[11px] text-[var(--color-text-grey)]">Version: 1.3.0</span>
          </div>
        </div>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
