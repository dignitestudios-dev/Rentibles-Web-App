"use client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eng_flag } from "@/public/images/export";
import Image from "next/image";
import { phoneFormatter } from "@/src/utils/helperFunctions";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode?: string;
  error?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ countryCode = "+1", error, className, onChange, ...props }, ref) => {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = phoneFormatter(e.target.value);
      setValue(formattedValue);

      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        });
      }
    };

    return (
      <div className="flex flex-col gap-1">
        <div
          className={`
            flex items-center gap-3 bg-background rounded-md px-4 h-12 shadow-sm
            ${error ? "border border-red-500" : ""}
          `}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-black">
            <Image src={Eng_flag} width={32} height={32} alt="eng_flag" />
            <span>{countryCode}</span>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <Input
            ref={ref}
            {...props}
            value={value}
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
