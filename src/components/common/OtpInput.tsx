"use client";

import { useRef } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const OtpInput = ({ value, onChange, error }: Props) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;

    const otpArr = value.split("");
    otpArr[index] = val;
    onChange(otpArr.join(""));

    if (val && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key !== "Backspace") return;

    const otpArr = value.split("");

    if (otpArr[index]) {
      otpArr[index] = "";
      onChange(otpArr.join(""));
      return;
    }

    if (index > 0) {
      otpArr[index - 1] = "";
      onChange(otpArr.join(""));
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <div className="flex gap-3 justify-center mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              if (el) inputsRef.current[i] = el;
            }}
            value={value[i] || ""}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            maxLength={1}
            className="
              w-16 h-16
              text-center
              rounded-lg
              bg-white
              border-2
              border-gray-300
              focus:border-orange-400
              focus:ring-1
              focus:ring-orange-400
              font-medium
              text-black
              text-lg
              outline-none
            "
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </>
  );
};
