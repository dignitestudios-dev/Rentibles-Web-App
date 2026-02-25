import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { TimeSlot, ProductAvailabilityDay } from "@/src/types/index.type"; // reuse shared definition
import { useProductAvailability } from "@/src/lib/api/products"; // custom hook we added

interface ProductAvailabilityProps {
  product: {
    _id: string;
    pricePerHour: number;
    pricePerDay: number;
    availableDays: string[]; // e.g., ["Monday", "Tuesday"]
  };
  onSlotSelect?: (slots: TimeSlot[]) => void;
  onDaySelect?: (date: Date) => void;
}

export const ProductAvailability: React.FC<ProductAvailabilityProps> = ({
  product,
  onSlotSelect,
  onDaySelect,
}) => {
  // Helper to convert 24-hour time to 12-hour AM/PM format
  const toAmPm = (hour: number): string => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = React.useState<TimeSlot[]>([]);
  const [slots, setSlots] = React.useState<TimeSlot[]>([]);

  const [selectionMode, setSelectionMode] = React.useState<
    "day" | "hour" | null
  >(null);

  // date used for API query (epoch seconds for first day of month)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // queryDate will hold the value we send to the API. initially today's
  // epoch, later the 1st of whatever month the user navigates to.
  const [queryDate, setQueryDate] = React.useState<number>(
    Math.floor(new Date().getTime() / 1000),
  );

  React.useEffect(() => {
    const today = new Date();
    if (
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth()
    ) {
      setQueryDate(Math.floor(today.getTime() / 1000));
    } else {
      const d = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );
      setQueryDate(Math.floor(d.getTime() / 1000));
    }
  }, [currentMonth]);

  // API call to fetch availability data for the month
  const { data: availabilityResp, isLoading: availabilityLoading } =
    useProductAvailability(product._id, queryDate);
  console.log("🚀 ~ ProductAvailability ~ availabilityResp:", availabilityResp);

  // Availability Data Setup
  const availabilityByDate = React.useMemo(() => {
    const map = new Map<number, ProductAvailabilityDay>();
    availabilityResp?.data?.data?.forEach((day: ProductAvailabilityDay) =>
      map.set(day.date, day),
    );
    return map;
  }, [availabilityResp]);

  // Example slots generation (adjust based on availability data when present)
  const generateSlots = React.useCallback(
    (date: Date): TimeSlot[] => {
      const slots: TimeSlot[] = [];

      // attempt to pull the exact day from the API response map
      const dayEpoch = Math.floor(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        ).getTime() / 1000,
      );
      const dayData = availabilityByDate.get(dayEpoch);

      if (dayData && dayData.slots.length > 0) {
        // build slots directly from server data so we get quantities
        return dayData.slots.map((s) => {
          const start = new Date(s.start * 1000);
          const end = new Date(s.end * 1000);
          const h1 = start.getHours();
          const h2 = end.getHours();
          const startLabel = toAmPm(h1);
          const endLabel = toAmPm(h2);
          return {
            startEpoch: s.start,
            endEpoch: s.end,
            startLabel,
            endLabel,
            label: `${startLabel} - ${endLabel}`,
            availableQuantity: s.availableQuantity,
          } as TimeSlot;
        });
      }

      // fallback to generic hourly slots
      for (let hour = 8; hour < 18; hour++) {
        const startEpoch =
          new Date(date.setHours(hour, 0, 0, 0)).getTime() / 1000;
        const endEpoch =
          new Date(date.setHours(hour + 1, 0, 0, 0)).getTime() / 1000;
        const startLabel = toAmPm(hour);
        const endLabel = toAmPm(hour + 1);

        slots.push({
          startEpoch,
          endEpoch,
          startLabel,
          endLabel,
          label: `${startLabel} - ${endLabel}`,
        });
      }
      return slots;
    },
    [availabilityByDate],
  );

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlots([]); // Reset selected slots when date changes
    setSelectionMode("hour");

    // Generate slots for selected date
    const generatedSlots = generateSlots(new Date(date));
    setSlots(generatedSlots);

    // Call callback
    onDaySelect?.(date);
  };

  // Handle time slot selection (multiple selection for hourly)
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlots((prevSlots) => {
      const isAlreadySelected = prevSlots.some(
        (s) => s.startEpoch === slot.startEpoch,
      );

      if (isAlreadySelected) {
        // Remove if already selected
        return prevSlots.filter((s) => s.startEpoch !== slot.startEpoch);
      } else {
        // Add if not selected and less than 3
        if (prevSlots.length < 3) {
          return [...prevSlots, slot];
        } else {
          // Can't add more than 3
          return prevSlots;
        }
      }
    });
  };

  // Handle day selection (single day mode)
  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    setSelectionMode("day");
    setSelectedSlots([]);
    onDaySelect?.(date);
  };

  // Check if slot is selected
  const isSlotSelected = (slot: TimeSlot): boolean => {
    return selectedSlots.some((s) => s.startEpoch === slot.startEpoch);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if date is available
  const isDateAvailable = (date: Date): boolean => {
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    return product.availableDays.includes(dayName);
  };

  // whenever availability info or the selected date changes, rebuild slot list
  React.useEffect(() => {
    if (selectedDate) {
      setSlots(generateSlots(new Date(selectedDate)));
    }
  }, [availabilityByDate, selectedDate, generateSlots]);

  // Calculate total hours
  const totalHours = selectedSlots.length;

  // Can submit when exactly 3 slots selected (for hourly mode)
  const canSubmit =
    selectionMode === "hour"
      ? selectedSlots.length === 3
      : selectionMode === "day"
        ? true
        : false;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Availability</h3>

      {/* Price Buttons - Selection Mode Indicator */}
      <div className="flex gap-4">
        {/* Per Hour Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setSelectionMode("hour");
            setSelectedSlots([]);
          }}
          className={`w-full px-6 py-4 rounded-2xl transition-all flex items-center justify-between ${
            selectionMode === "hour"
              ? "bg-orange-400/30 dark:bg-orange-900/20 ring-2 ring-orange-400"
              : "bg-orange-400/20 dark:bg-orange-900/10 hover:bg-orange-400/30 dark:hover:bg-orange-900/20"
          }`}
        >
          <div className="text-left flex-1">
            <p className="text-2xl font-bold text-primary">
              ${product.pricePerHour.toLocaleString()}/
              <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                hr
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedDate
                ? formatDate(selectedDate)
                : "Select date & 3 slots"}
            </p>
            {selectionMode === "hour" && selectedSlots.length > 0 && (
              <p className="text-xs text-orange-600 font-semibold mt-1">
                {selectedSlots.length}/3 slots selected
              </p>
            )}
          </div>
        </button>

        {/* Per Day Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setSelectionMode("day");
            setSelectedSlots([]);
          }}
          className={`w-full px-6 py-4 rounded-2xl transition-all flex items-center justify-between ${
            selectionMode === "day"
              ? "bg-orange-400/30 dark:bg-orange-900/20 ring-2 ring-orange-400"
              : "bg-orange-400/20 dark:bg-orange-900/10 hover:bg-orange-400/30 dark:hover:bg-orange-900/20"
          }`}
        >
          <div className="text-left flex-1">
            <p className="text-2xl font-bold text-primary">
              ${(product.pricePerDay || 0).toLocaleString()}/
              <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                day
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedDate ? formatDate(selectedDate) : "Select date"}
            </p>
          </div>
        </button>
      </div>

      {/* Calendar */}
      {isOpen && (
        <div className="space-y-4">
          {availabilityLoading && (
            <p className="text-xs text-gray-500">Loading availability…</p>
          )}

          <Calendar
            selected={selectedDate}
            month={currentMonth}
            onMonthChange={(m) => setCurrentMonth(m)}
            // calendar props extend html attributes so the onSelect type is
            // unfortunately an intersection of `(date: Date)` and the DOM
            // event handler. we cast to `any` below.
            onSelect={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (selectionMode === "hour"
                ? handleDateSelect
                : handleSelectDay) as any
            }
            disabled={(date) => {
              // Disable past dates
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const checkDate = new Date(date);
              checkDate.setHours(0, 0, 0, 0);

              if (checkDate < today) return true;

              // Disable dates not in availableDays or zero quantity
              if (!isDateAvailable(date)) return true;
              // also block if API says minQuantity === 0
              const epoch = Math.floor(
                new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                ).getTime() / 1000,
              );
              const dayData = availabilityByDate.get(epoch);
              if (dayData && dayData.minQuantity <= 0) return true;
              return false;
            }}
            className="shadow-lg border-2 border-primary/20"
          />

          {/* Time Slots Section - Only for Hourly Mode */}
          {selectionMode === "hour" && selectedDate && (
            <div className="space-y-4">
              {slots.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No available time slots.
                </p>
              ) : (
                <>
                  {/* Information Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Select exactly 3 time slots
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          You must select 3 consecutive or non-consecutive
                          hourly slots for this rental period.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Slots Summary */}
                  {selectedSlots.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                          {selectedSlots.length} of 3 slots selected
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSlots
                          .sort((a, b) => a.startEpoch - b.startEpoch)
                          .map((slot) => (
                            <span
                              key={slot.startEpoch}
                              className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                            >
                              {slot.startLabel} - {slot.endLabel}
                            </span>
                          ))}
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                        Total: {totalHours} hours
                      </p>
                    </div>
                  )}

                  {/* Slot Grid */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Available time slots:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((slot) => {
                        const isSelected = isSlotSelected(slot);
                        const slotQty = slot.availableQuantity ?? undefined;
                        const isDisabled =
                          (!isSelected && selectedSlots.length >= 3) ||
                          (slotQty !== undefined && slotQty <= 0);

                        return (
                          <button
                            key={slot.startEpoch}
                            type="button"
                            onClick={() => handleSlotSelect(slot)}
                            disabled={isDisabled}
                            className={[
                              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-150",
                              "focus:outline-none focus:ring-2 focus:ring-offset-1",
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white shadow-md focus:ring-blue-500"
                                : isDisabled
                                  ? "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer",
                            ].join(" ")}
                            title={
                              isDisabled ? "Maximum 3 slots allowed" : undefined
                            }
                          >
                            <span className="block">{slot.startLabel}</span>
                            <span className="block text-xs opacity-70">
                              – {slot.endLabel}
                            </span>
                            {slotQty !== undefined && (
                              <span className="block text-xs mt-1">
                                {slotQty} available
                              </span>
                            )}
                            {isSelected && (
                              <span className="block text-xs mt-1">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={!canSubmit}
                    onClick={() => {
                      if (canSubmit) {
                        onSlotSelect?.(selectedSlots);
                        // You can also show confirmation or move to next step
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      canSubmit
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {selectedSlots.length === 0
                      ? "Select 3 time slots to continue"
                      : selectedSlots.length < 3
                        ? `Select ${3 - selectedSlots.length} more slot(s)`
                        : "Continue with selected slots"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Day Selection Mode Message */}
          {selectionMode === "day" && selectedDate && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    ✓ {formatDate(selectedDate)} selected
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSlotSelect?.([]);
                  setIsOpen(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Confirm Day Selection
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary when not open */}
      {!isOpen && selectedDate && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm">
          {selectionMode === "hour" && selectedSlots.length > 0 ? (
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Selected: {selectedSlots.length}/3 time slots
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedSlots
                  .sort((a, b) => a.startEpoch - b.startEpoch)
                  .map((s) => `${s.startLabel}-${s.endLabel}`)
                  .join(", ")}
              </p>
            </div>
          ) : selectionMode === "day" ? (
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Selected: {formatDate(selectedDate)}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};
