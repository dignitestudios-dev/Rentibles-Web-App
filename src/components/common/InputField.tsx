"use client";

import { Input as RadixInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState, forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputType?: string;
}

// eslint-disable-next-line react/display-name
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = "text", error, className, inputType, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full flex flex-col gap-1 relative">
        {label && <Label className="text-foreground">{label}</Label>}

        <div className="relative w-full">
          <RadixInput
            ref={ref}
            {...props}
            onChange={(e) => {
              let value = e.target.value;

              switch (inputType) {
                case "letter":
                  value = value.replace(/[^A-Za-z\s]/g, "");
                  value = value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  break;

                case "email":
                  value = value.replace(/\s+/g, "");
                  break;

                case "numeric":
                  value = value.replace(/[^0-9]/g, "");
                  break;

                case "password":
                  // no transformation
                  break;

                default:
                  // Sentence Case (first letter uppercase, rest lowercase)
                  value =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                  break;
              }

              value = value.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
              console.log("🚀 ~ value 60:", value);

              e.target.value = value;
              props.onChange?.(e);
            }}
            type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
            className={`
              text-foreground
            h-12.25
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground"
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
