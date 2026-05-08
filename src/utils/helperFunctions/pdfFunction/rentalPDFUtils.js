// ============================================================
// rentalPDFUtils.js
// Utility functions to compute and format rental booking values
// before passing them to generateRentalPolicyPDF.
// ============================================================

/**
 * Formats a Date object to "DD Month YYYY"
 * e.g. "10 January 2025"
 */
const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

/**
 * Formats an epoch (seconds) to "HH:MM AM/PM"
 */
const formatTime = (epochSeconds) =>
  new Date(epochSeconds * 1000).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

// ─────────────────────────────────────────────────────────────
// BOOKING DATE STRING
// Returns the booking date range (day mode) or single date (hour mode)
// ─────────────────────────────────────────────────────────────
/**
 * @param {"day"|"hour"} selectionMode
 * @param {{ from: Date, to?: Date }|null} dateRange   - used in day mode
 * @param {Array<{ startEpoch: number }>} timeSlots    - used in hour mode
 * @returns {string}
 */
export const getBookingDateString = (
  selectionMode,
  dateRange,
  timeSlots = [],
) => {
  if (selectionMode === "day" && dateRange?.from) {
    const from = dateRange.from;
    const to = dateRange.to ?? dateRange.from;
    return from.getTime() === to.getTime()
      ? formatDate(from)
      : `${formatDate(from)} - ${formatDate(to)}`;
  }

  if (selectionMode === "hour" && timeSlots.length > 0) {
    const sorted = [...timeSlots].sort((a, b) => a.startEpoch - b.startEpoch);
    return formatDate(new Date(sorted[0].startEpoch * 1000));
  }

  return "—";
};

// ─────────────────────────────────────────────────────────────
// BOOKING TIME STRING
// Returns time window — pickup/dropoff (day mode) or slot range (hour mode)
// ─────────────────────────────────────────────────────────────
/**
 * @param {"day"|"hour"} selectionMode
 * @param {number} pickupTime    - epoch seconds (used in day mode)
 * @param {number} dropOffTime   - epoch seconds (used in day mode)
 * @param {Array<{ startEpoch: number, endEpoch: number }>} timeSlots
 * @returns {string}
 */
export const getBookingTimeString = (
  selectionMode,
  pickupTime,
  dropOffTime,
  timeSlots = [],
) => {
  if (selectionMode === "day" && pickupTime && dropOffTime) {
    return `${formatTime(pickupTime)} - ${formatTime(dropOffTime)}`;
  }

  if (selectionMode === "hour" && timeSlots.length > 0) {
    const sorted = [...timeSlots].sort((a, b) => a.startEpoch - b.startEpoch);
    return `${formatTime(sorted[0].startEpoch)} - ${formatTime(sorted[sorted.length - 1].endEpoch)}`;
  }

  return "—";
};

// ─────────────────────────────────────────────────────────────
// BOOKING DATE & TIME — combined single string for the PDF field
// ─────────────────────────────────────────────────────────────
/**
 * @returns {string}  e.g. "10 January 2025, 09:00 AM"
 */
export const getBookingDateTimeString = (
  selectionMode,
  dateRange,
  timeSlots,
  pickupTime,
  dropOffTime,
) => {
  const date = getBookingDateString(selectionMode, dateRange, timeSlots);
  const time = getBookingTimeString(
    selectionMode,
    pickupTime,
    dropOffTime,
    timeSlots,
  );
  if (date === "—") return "—";
  return `${date}, ${time}`;
};

// ─────────────────────────────────────────────────────────────
// RETURN DATE & TIME — combined single string for the PDF field
// ─────────────────────────────────────────────────────────────
/**
 * For day mode: return date = last day + dropoff time
 * For hour mode: return = same date + end of last slot
 * @returns {string}
 */
export const getReturnDateTimeString = (
  selectionMode,
  dateRange,
  timeSlots,
  dropOffTime,
) => {
  if (selectionMode === "day" && dateRange?.from) {
    const to = dateRange.to ?? dateRange.from;
    return `${formatDate(to)}, ${formatTime(dropOffTime)}`;
  }

  if (selectionMode === "hour" && timeSlots.length > 0) {
    const sorted = [...timeSlots].sort((a, b) => a.startEpoch - b.startEpoch);
    const lastSlot = sorted[sorted.length - 1];
    return `${formatDate(new Date(lastSlot.endEpoch * 1000))}, ${formatTime(lastSlot.endEpoch)}`;
  }

  return "—";
};

// ─────────────────────────────────────────────────────────────
// TOTAL AMOUNT
// ─────────────────────────────────────────────────────────────
/**
 * @param {"day"|"hour"|null} selectionMode
 * @param {{ from?: Date | undefined; to?: Date | undefined; } | undefined} dateRange
 * @param {Array<{ startEpoch: number, endEpoch: number }>} timeSlots
 * @param {number} quantity
 * @param {number} pricePerDay
 * @param {number} pricePerHour
 * @returns {string}  e.g. "$250.00"
 */
export const getTotalAmountString = (
  selectionMode,
  dateRange,
  timeSlots,
  quantity,
  pricePerDay,
  pricePerHour,
) => {
  let total = 0;

  if (selectionMode === "day" && dateRange?.from) {
    const from = dateRange.from;
    const to = dateRange.to ?? dateRange.from;
    const days =
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    total = pricePerDay * quantity * days;
  } else if (selectionMode === "hour" && timeSlots.length > 0) {
    const sorted = [...timeSlots].sort((a, b) => a.startEpoch - b.startEpoch);
    const start = new Date(sorted[0].startEpoch * 1000);
    const end = new Date(sorted[sorted.length - 1].endEpoch * 1000);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    total = pricePerHour * quantity * Math.max(1, Math.ceil(hours));
  }

  return `$${total.toFixed(2)}`;
};
