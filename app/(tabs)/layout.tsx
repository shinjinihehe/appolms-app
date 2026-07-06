"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const CoursesIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const CartIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const AccountIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/home", icon: HomeIcon },
    { name: "My Courses", href: "/my-courses", icon: CoursesIcon },
    { name: "My Cart", href: "/my-cart", icon: CartIcon },
    { name: "Account", href: "/account", icon: AccountIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] relative">
      <div className="flex-1 pb-20">
        {children}
      </div>

      {/* Floating Action Button (Filter) - only show on certain pages? The screenshot shows it on the login page? Wait, no, filter is shown when not in Cart. Let's just always show it for now like screenshot. */}
      {pathname !== '/my-cart' && (
        <div className="fixed bottom-[80px] right-4 z-50">
          <Link href="/filter" className="w-14 h-14 bg-white rounded-full shadow-lg border border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] cursor-pointer hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </Link>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            // Note: Since Account renders Login form in the same route when unauthenticated, it highlights "Account"
            const isActive = pathname === tab.href || (pathname === '/login' && tab.href === '/account');
            
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                  isActive ? "text-[#5851EF]" : "text-[#757575] hover:text-gray-500"
                }`}
              >
                <tab.icon active={isActive} />
                <span className="text-[11px] font-medium mt-1">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
