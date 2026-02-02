"use client";
import { Input as RadixInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface InputFieldProps {
  id?: string;
  name: string;
  label?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  onChange,
  onBlur,
  error,
  touched,
  className,
  
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showPasswordToggle = type === "password";

  return (
    <div className="w-full flex flex-col gap-1 relative">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative w-full">
        <RadixInput
          id={id}
          name={name}
          type={
            showPasswordToggle
              ? isPasswordVisible
                ? "text"
                : "password"
              : type
          }
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${error && touched ? "border-red-500" : ""} ${className} h-12.25`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
          >
            {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        )}
      </div>

      {error && touched && (
        <p className="text-red-700 text-sm font-medium">{error}</p>
      )}
    </div>
  );
};
