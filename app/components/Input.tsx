"use client";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 mb-4">
        {label && <label className="text-sm font-medium text-[var(--color-text-dark)]">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-[var(--color-text-grey)]">{icon}</div>}
          <input
            ref={ref}
            className={`w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-xl py-3 px-4 outline-none focus:border-[var(--color-primary)] transition-colors duration-200 placeholder-[var(--color-text-grey)] ${
              icon ? "pl-10" : ""
            } ${error ? "border-red-500 focus:border-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
