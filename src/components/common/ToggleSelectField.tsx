"use client";

import { useEffect, useRef, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ToggleSelectField = () => {
  const [open, setOpen] = useState(false);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    Monday: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDay = (day: string) => {
    setActiveDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDays = Object.keys(activeDays).filter((day) => activeDays[day]);

  return (
    <div ref={containerRef} className="relative">
      <Label className="text-foreground">Availabe Days</Label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-[#2e2e2e] mt-1 border-2 border-foreground   h-12.25 px-4 rounded-md flex items-center justify-between text-foreground"
      >
        <span className="text-sm truncate">
          {selectedDays.length > 0
            ? selectedDays.join(", ")
            : "Select Available Days"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl overflow-hidden border border-foreground shadow-xl">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-none"
            >
              <span className="text-foreground">{day}</span>

              <ToggleSwitch
                checked={!!activeDays[day]}
                onChange={() => toggleDay(day)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToggleSelectField;
