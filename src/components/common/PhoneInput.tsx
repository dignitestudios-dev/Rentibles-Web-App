"use client";

import { forwardRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Eng_flag } from "@/public/images/export";
import Image from "next/image";
import { phoneFormatter } from "@/src/utils/helperFunctions";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode?: string;
  error?: string;
  value?: string;
}

// eslint-disable-next-line react/display-name
const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      countryCode = "+1",
      error,
      className,
      onChange,
      value: propValue,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState("");

    // If propValue is provided, it's the raw value from form, format it for display
    // If not provided, use internal state for backward compatibility
    const displayValue =
      propValue !== undefined ? phoneFormatter(propValue) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const digitsOnly = inputValue.replace(/\D/g, "");

      if (propValue === undefined) {
        // Uncontrolled mode
        const formattedValue = phoneFormatter(inputValue);
        setInternalValue(formattedValue);
        if (onChange) {
          onChange({
            ...e,
            target: {
              ...e.target,
              value: digitsOnly, // Store raw digits in form
            },
          });
        }
      } else {
        // Controlled mode - update form with raw digits
        if (onChange) {
          onChange({
            ...e,
            target: {
              ...e.target,
              value: digitsOnly,
            },
          });
        }
      }
    };

    return (
      <div className="flex flex-col gap-1">
        <div
          className={`
            flex items-center gap-3 bg-background dark:border-2 dark:border-muted rounded-md px-4 h-12 shadow-sm
            ${error ? "border border-red-500" : ""}
          `}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Image src={Eng_flag} width={32} height={32} alt="eng_flag" />
            <span>{countryCode}</span>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <Input
            ref={ref}
            {...props}
            value={displayValue}
            onChange={handleChange}
            className="border-0 focus-visible:ring-0 px-0"
            inputMode="numeric"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
      </div>
    );
  },
);

export default PhoneInput;
