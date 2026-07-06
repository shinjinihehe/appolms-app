"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../../components/Button";

export default function WishlistPage() {
  const wishlistItems = [
    { id: 2, title: "Complete UI/UX Design Masterclass", instructor: "Jane Smith", price: "$89.99", rating: 4.9, image: "https://via.placeholder.com/150" },
    { id: 3, title: "Python for Data Science", instructor: "Alan Turing", price: "$59.99", rating: 4.7, image: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-14 px-6 bg-[var(--color-background)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-dark)]">Wishlist</h1>
        <p className="text-[var(--color-text-grey)] text-sm mt-1">Courses you want to learn.</p>
      </div>

      <div className="flex flex-col space-y-4">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((course) => (
            <Link key={course.id} href={`/course/${course.id}`} className="bg-white rounded-2xl p-3 flex shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-50 relative">
              <button className="absolute top-2 right-2 p-1.5 bg-red-50 rounded-full text-red-500 hover:bg-red-100 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <div className="w-28 h-28 bg-gray-200 rounded-xl flex-shrink-0 mr-4 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1 pr-6">
                <div>
                  <h3 className="font-bold text-[var(--color-text-dark)] text-[13px] line-clamp-2 leading-tight mb-1">{course.title}</h3>
                  <p className="text-xs text-[var(--color-text-grey)]">{course.instructor}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-[var(--color-primary)] text-sm">{course.price}</span>
                  <div className="flex items-center text-xs text-[var(--color-text-grey)]">
                    <span className="text-[var(--color-accent-star)] mr-1">★</span> {course.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-grey)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-2">Wishlist is empty</h3>
            <p className="text-[var(--color-text-grey)] text-sm mb-6">Add courses to your wishlist to find them later.</p>
            <Link href="/home">
              <Button>Explore Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
