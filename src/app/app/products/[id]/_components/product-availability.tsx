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
    quantity: number; // total quantity available for day-based rentals
  };
  onSlotSelect?: (slots: TimeSlot[]) => void;
  onDaySelect?: (date: Date) => void;
  setAvailableQuantity: (qty: number) => void; // new callback to set available quantity in parent
  onSelectionModeChange?: (mode: "day" | "hour" | null) => void;
  onDateRangeChange?: (range: { from?: Date; to?: Date } | undefined) => void;
}

export const ProductAvailability: React.FC<ProductAvailabilityProps> = ({
  product,
  onSlotSelect,
  onDaySelect,
  setAvailableQuantity,
  onDateRangeChange,
  onSelectionModeChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = React.useState<TimeSlot[]>([]);

  const [slots, setSlots] = React.useState<TimeSlot[]>([]);

  const [dateRange, setDateRange] = React.useState<
    { from?: Date; to?: Date } | undefined
  >();

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

  // Availability Data Setup
  const availabilityMap = React.useMemo(() => {
    const map = new Map<number, ProductAvailabilityDay>();

    availabilityResp?.data?.forEach((day: ProductAvailabilityDay) => {
      map.set(day.date, day);
    });

    return map;
  }, [availabilityResp]);

  // For epoch conversion
  const getDateKey = (date: Date) => {
    const d = new Date(date);

    return Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000,
    );
  };

  const generateSlots = (date: Date): TimeSlot[] => {
    const dateKey = getDateKey(date);
    const dayData = availabilityMap.get(dateKey);
    console.log(dayData,"avaliablity")

    if (!dayData || !dayData.slots?.length) return [];
    

    return dayData.slots.map((s) => {
      const startLabel = new Date(s.start * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const endLabel = new Date(s.end * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        startEpoch: s.start,
        endEpoch: s.end,
        startLabel,
        endLabel,
        label: `${startLabel} - ${endLabel}`,
        availableQuantity: s.availableQuantity,
      } as TimeSlot;
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlots([]); // Reset selected slots when date changes
    setSelectionMode("hour");
    onSelectionModeChange?.("hour");

    // Generate slots for selected date
    const generatedSlots = generateSlots(new Date(date));
    console.log(new Date(date),generatedSlots,"checking Dates")

    setSlots(generatedSlots);

    // Call callback
    onDaySelect?.(date);
  };

  // Handle time slot selection (multiple selection for hourly)
  // const handleSlotSelect = (slot: TimeSlot) => {
  //   setSelectedSlots((prev) => {
  //     const slotIndex = slots.findIndex(
  //       (s) => s.startEpoch === slot.startEpoch,
  //     );

      

  //     const selectedIndexes = prev
  //       .map((s) => slots.findIndex((sl) => sl.startEpoch === s.startEpoch))
  //       .sort((a, b) => a - b);

  //     const isSelected = selectedIndexes.includes(slotIndex);

  //     // Remove if clicked again
  //     if (isSelected) {
  //       return prev.filter((s) => s.startEpoch !== slot.startEpoch);
  //     }

  //     // First slot can be anything
  //     if (selectedIndexes.length === 0) {
  //       return [slot];
  //     }

  //     // Don't allow more than 4
  //     if (selectedIndexes.length >= slots.length) {
  //       return prev;
  //     }

  //     const min = selectedIndexes[0];
  //     const max = selectedIndexes[selectedIndexes.length - 1];

  //     // Allow only adjacent expansion
  //     if (slotIndex === min - 1 || slotIndex === max + 1) {
  //       return [...prev, slot];
  //     }

  //     // ✅ Non-consecutive selection: clear previous and start fresh with this slot
  //     return [slot];
  //   });
  // };

  // Convert ISO date string to Unix timestamp (in seconds)
  // const getUnixTimestamp = (dateString: string) => {
  //   return Math.floor(new Date(dateString + "T00:00:00Z").getTime() / 1000);
  // };



  

  const handleSlotSelect = (slot: TimeSlot) => {
  setSelectedSlots((prev) => {
    const slotIndex = slots.findIndex(
      (s) => s.startEpoch === slot.startEpoch,
    );

    const selectedIndexes = prev
      .map((s) =>
        slots.findIndex((sl) => sl.startEpoch === s.startEpoch),
      )
      .sort((a, b) => a - b);

    const isSelected = selectedIndexes.includes(slotIndex);

    // ✅ Remove if already selected (toggle off)
    if (isSelected) {
      return prev.filter((s) => s.startEpoch !== slot.startEpoch);
    }

    // ✅ First selection
    if (selectedIndexes.length === 0) {
      return [slot];
    }

    // ❌ Prevent selecting more than 4
    if (prev.length >= 4) {
      return prev;
    }

    const min = selectedIndexes[0];
    const max = selectedIndexes[selectedIndexes.length - 1];

    // ✅ Allow only adjacent expansion
    if (slotIndex === min - 1 || slotIndex === max + 1) {
      return [...prev, slot];
    }

    // 🔁 If non-adjacent → reset and start fresh
    return [slot];
  });
};

React.useEffect(() => {
  if (selectionMode === "hour" && selectedSlots.length >= 4) {
    onSlotSelect?.(selectedSlots);
  }
}, [selectedSlots, selectionMode, onSlotSelect]);

  const getUnixTimestamp = (date: Date) => {
    return Math.floor(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000,
    );
  };

  // Handle day selection (single day mode)
  const handleSelectDay = (range: { from?: Date; to?: Date } | undefined) => {
    setSelectionMode("day");
    onSelectionModeChange?.("day");

    setSelectedSlots([]);

    setDateRange(range);
    onDateRangeChange?.(range);

    if (!range?.from) return;
    // const dateKey = new Date(range.from).toISOString().split("T")[0];
    const unixTimestamp = getUnixTimestamp(range.from);

    const minQuantity = availabilityMap.get(unixTimestamp)?.minQuantity;
    const availableQty = minQuantity ?? product.quantity;

    setAvailableQuantity(availableQty ?? 0);

    // onDaySelect?.(range.from);
    onDateRangeChange?.(range);
  };

  const isSlotSelected = (slot: TimeSlot): boolean => {
    const selected = selectedSlots.some(
      (s) => s.startEpoch === slot.startEpoch,
    );

    // Compute the minimum availableQuantity among all selected slots
    const minAvailableQuantity = selectedSlots.reduce((min, s) => {
      return s.availableQuantity! < min ? s.availableQuantity! : min;
    }, Infinity);
    setAvailableQuantity(minAvailableQuantity);
    return selected;
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
  // React.useEffect(() => {
  //   if (selectedDate) {
  //     setSlots(generateSlots(new Date(selectedDate)));
  //   }
  // }, [availabilityByDate, selectedDate, generateSlots]);


const now = new Date();
const currentHour = now.getHours();

  // Can submit when exactly 3 slots selected (for hourly mode)
  const canSubmit =
    selectionMode === "hour"
      ? selectedSlots.length >= 4
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
          type="button"
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
                : "Select date & 4 slots"}
            </p>
            {/* {selectionMode === "hour" && selectedSlots.length > 0 && (
              <p className="text-xs text-orange-600 font-semibold mt-1">
                {selectedSlots.length}/3 slots selected
              </p>
            )} */}
          </div>
        </button>

        {/* Per Day Button */}
        <button
          type="button"
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
            mode={selectionMode === "hour" ? "single" : "range"}
            selected={
              selectionMode === "hour"
                ? (selectedDate as Date | undefined)
                : (dateRange as any)
            }
            // selected={selectedDate}
            month={currentMonth}
            onMonthChange={(m) => setCurrentMonth(m)}
            // calendar props extend html attributes so the onSelect type is
            // unfortunately an intersection of `(date: Date)` and the DOM
            // event handler. we cast to `any` below.
            onSelect={
              (selectionMode === "hour"
                ? handleDateSelect
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  handleSelectDay) as any
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
              // const epoch = Math.floor(
              //   new Date(
              //     date.getFullYear(),
              //     date.getMonth(),
              //     date.getDate(),
              //   ).getTime() / 1000,
              // );
              // const dayData = availabilityByDate.get(epoch);
              // if (dayData && dayData.minQuantity <= 0) return true;
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
                          Minimum-Hour Booking Required
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Booking 4 Hour or More, No Shorter Sessions Allowed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slot Grid */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Available time slots:
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots
  .filter(slot => {
    const slotDate = new Date(slot.startEpoch * 1000);
    const slotHour = slotDate.getHours();
    return slotHour < 19; // only keep slots before 7 PM (19)
  })
  .map((slot) => {
    const isSelected = isSlotSelected(slot);
    const slotQty = slot.availableQuantity ?? undefined;

    const slotDate = new Date(slot.startEpoch * 1000);
    const slotHour = slotDate.getHours();

    const isSameDay = now.toDateString() === slotDate.toDateString();
    const isPastTime = isSameDay && slotHour < currentHour;

    const isDisabled =
      isPastTime ||
      (!isSelected && selectedSlots.length >= 4) ||
      (slotQty !== undefined && slotQty <= 0);

    return (
      <button
        key={slot.startEpoch}
        type="button"
        onClick={() => handleSlotSelect(slot)}
        disabled={isDisabled}
        className={[
          "rounded-xl py-6 text-xs font-medium transition-colors duration-150 select-none whitespace-nowrap",
          isSelected
            ? "bg-orange-600 text-white shadow-md focus:ring-orange-400"
            : isDisabled
              ? "bg-gray-400 text-gray-300 cursor-not-allowed"
              : "bg-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer",
        ].join(" ")}
        title={isDisabled ? "Slot unavailable" : undefined}
      >
        {slot.startLabel}–{slot.endLabel}
      </button>
    );
  })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  {/* <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => {
                      if (canSubmit) {
                        onSlotSelect?.(selectedSlots);
                        setIsOpen(false);
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
                      ? "Select 4 time slots to continue"
                      : selectedSlots.length < 4
                        ? `Select ${4 - selectedSlots.length} more slot(s)`
                        : "Continue with selected slots"}
                  </button> */}
                </>
              )}
            </div>
          )}

          {/* Day Selection Mode Message */}
          {selectionMode === "day" && dateRange?.from && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    ✓ {formatDate(dateRange.from)}
                    {dateRange.to && dateRange.to !== dateRange.from && (
                      <> – {formatDate(dateRange.to)}</>
                    )}{" "}
                    selected
                  </p>
                </div>
              </div>

              {/* <button
                type="button"
                onClick={() => {
                  onSlotSelect?.([]);
                  setIsOpen(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Confirm Day Selection
              </button> */}
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
                Selected: {selectedSlots.length}/{slots.length} time slots
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
