"use client";

import { Input as RadixInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState, forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = "text", error, className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full flex flex-col gap-1 relative">
        {label && <Label>{label}</Label>}

        <div className="relative w-full">
          <RadixInput
            ref={ref}
            {...props}
            type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
            className={`
            h-12.25
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </div>
    );
  },
);
