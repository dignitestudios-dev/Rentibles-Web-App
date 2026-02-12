"use client";

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, error, options, placeholder = "Select", className, ...props },
    ref,
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && <Label className="text-foreground">{label}</Label>}

        <select
          ref={ref}
          {...props}
          className={`
            w-full
            h-12.25
            rounded-md
            bg-background
            px-3
            text-foreground
            border
            outline-none
            focus:ring-2
            focus:ring-ring
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-background"
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
