// components/DaySelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, Check } from "lucide-react";
import { DaySchedule, DaysOfWeek } from "@/src/types/index.type";

export const defaultDaysOfWeek: DaySchedule[] = [
  { id: "mon", day: "Monday", shortName: "Mon", enabled: false, order: 1 },
  { id: "tue", day: "Tuesday", shortName: "Tue", enabled: false, order: 2 },
  { id: "wed", day: "Wednesday", shortName: "Wed", enabled: false, order: 3 },
  { id: "thu", day: "Thursday", shortName: "Thu", enabled: false, order: 4 },
  { id: "fri", day: "Friday", shortName: "Fri", enabled: false, order: 5 },
  { id: "sat", day: "Saturday", shortName: "Sat", enabled: false, order: 6 },
  { id: "sun", day: "Sunday", shortName: "Sun", enabled: false, order: 7 },
];

interface DaySelectorProps {
  selectedDays?: DaysOfWeek;
  onChange?: (days: DaysOfWeek) => void;
  label?: string;
  showSelectedCount?: boolean;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onChange,
  label = "Select Days",
  showSelectedCount = true,
}) => {
  const [days, setDays] = useState<DaysOfWeek>(
    selectedDays || defaultDaysOfWeek,
  );

  useEffect(() => {
    if (selectedDays) {
      setDays(selectedDays);
    }
  }, [selectedDays]);

  const handleToggleDay = (dayId: string) => {
    const updatedDays = days.map((day) =>
      day.id === dayId ? { ...day, enabled: !day.enabled } : day,
    );

    setDays(updatedDays);

    if (onChange) {
      onChange(updatedDays);
    }
  };

  const getSelectedDaysText = (): string => {
    const enabledDays = days.filter((day) => day.enabled);

    if (enabledDays.length === 0) {
      return "No days selected";
    }

    if (enabledDays.length === 7) {
      return "Every day";
    }

    if (enabledDays.length === 1) {
      return enabledDays[0].day;
    }

    return enabledDays.map((day) => day.shortName).join(", ");
  };

  const selectedCount = days.filter((day) => day.enabled).length;

  return (
    <div className="space-y-3">
      {/* Label and Selected Display */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">{label}</Label>

        {/* Selected Days Display Field */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-900 flex-1">
            {getSelectedDaysText()}
          </span>
          {showSelectedCount && selectedCount > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {selectedCount} {selectedCount === 1 ? "day" : "days"}
            </span>
          )}
        </div>
      </div>

      {/* Days List with Toggles */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {days.map((day) => (
          <div
            key={day.id}
            className={`flex items-center justify-between px-4 py-3 transition-colors ${
              day.enabled ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Check Icon for Selected Days */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  day.enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                {day.enabled && <Check className="w-4 h-4 text-white" />}
              </div>

              {/* Day Name */}
              <div>
                <p
                  className={`font-medium ${
                    day.enabled ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {day.day}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <Switch
              checked={day.enabled}
              onCheckedChange={() => handleToggleDay(day.id)}
              aria-label={`Toggle ${day.day}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaySelector;
