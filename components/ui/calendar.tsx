"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  month?: Date;
  onMonthChange?: (date: Date) => void;
};

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      selected,
      onSelect,
      disabled,
      month: monthProp,
      onMonthChange,
      ...props
    },
    ref,
  ) => {
    const [month, setMonth] = React.useState<Date>(monthProp || new Date());

    const monthLabel = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(month);

    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: (Date | null)[] = [];
    let current = new Date(startDate);

    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const handlePrevMonth = () => {
      const newMonth = new Date(month);
      newMonth.setMonth(newMonth.getMonth() - 1);
      setMonth(newMonth);
      onMonthChange?.(newMonth);
    };

    const handleNextMonth = () => {
      const newMonth = new Date(month);
      newMonth.setMonth(newMonth.getMonth() + 1);
      setMonth(newMonth);
      onMonthChange?.(newMonth);
    };

    const isToday = (date: Date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const isSelected = (date: Date) => {
      return (
        selected &&
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 rounded-lg border border-border bg-background",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">{monthLabel}</h2>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-7 w-7 p-0",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-7 w-7 p-0",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const isCurrentMonth = day && day.getMonth() === month.getMonth();
            const isDisabled = !isCurrentMonth || (day && disabled?.(day));
            const daySelected = isSelected(day || new Date());
            const dayIsToday = day && isToday(day);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (day && onSelect && !isDisabled) {
                    onSelect(day);
                  }
                }}
                disabled={isDisabled}
                className={cn(
                  "h-8 w-8 text-sm rounded-md font-medium flex items-center justify-center transition-colors",
                  isDisabled
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "hover:bg-primary/10 cursor-pointer",
                  daySelected &&
                    "bg-primary text-primary-foreground hover:bg-primary",
                  dayIsToday && !daySelected && "border border-primary",
                )}
              >
                {day?.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

Calendar.displayName = "Calendar";

export { Calendar };
