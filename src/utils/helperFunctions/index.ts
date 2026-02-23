import { TimeSlot, TimeSlotResult } from "@/src/types/index.type";
import { useEffect, useState } from "react";

export const phoneFormatter = (input: string): string => {
  if (!input) return "";

  let cleaned = input.replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    cleaned = cleaned.slice(1);
  }

  cleaned = cleaned.slice(0, 10);

  if (cleaned.length < 4) {
    return `(${cleaned}`;
  }

  if (cleaned.length < 7) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  }

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

export const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) u8arr[n] = bstr.charCodeAt(n);

  return new File([u8arr], filename, { type: mime });
};

export function formatDateToMMDDYYYY(
  dateString: string | null | undefined | number,
): string {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "—";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export const toUnixTimestamp = (time: string): number => {
  // Assume today's date, combine with time string
  const today = new Date();
  const [hours, minutes] = time.split(":").map(Number);

  today.setHours(hours, minutes, 0, 0);

  return Math.floor(today.getTime() / 1000); // convert ms → seconds
};

export const getAddressFromLatLng = (
  lat: number,
  lng: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject("Google Maps not loaded");
      return;
    }

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        resolve(results[0].formatted_address);
      } else {
        reject("Unable to fetch address");
      }
    });
  });
};

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function epochToTimeLabel(epochSeconds: number): string {
  const date = new Date(epochSeconds * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = String(minutes).padStart(2, "0");
  return `${String(displayHour).padStart(2, "0")}:${displayMinutes} ${period}`;
}

/**
 * Returns the difference in hours between two epochs (seconds).
 * Returns a float; e.g. 5.5 means 5 hours 30 minutes.
 */

export function epochDiffInHours(startEpoch: number, endEpoch: number): number {
  if (endEpoch <= startEpoch) return 0;
  return (endEpoch - startEpoch) / 3600;
}

export function generateTimeSlots(
  pickupEpoch: number | undefined | null,
  dropOffEpoch: number | undefined | null,
): TimeSlotResult {
  if (!pickupEpoch || !dropOffEpoch || dropOffEpoch <= pickupEpoch) {
    return { slots: [], totalHours: 0, pickupLabel: "", dropOffLabel: "" };
  }

  const totalHours = epochDiffInHours(pickupEpoch, dropOffEpoch);
  const fullSlotCount = Math.floor(totalHours); // whole 1-hour slots only

  const slots: TimeSlot[] = Array.from({ length: fullSlotCount }, (_, i) => {
    const slotStart = pickupEpoch + i * 3600;
    const slotEnd = slotStart + 3600;
    const startLabel = epochToTimeLabel(slotStart);
    const endLabel = epochToTimeLabel(slotEnd);
    return {
      label: `${startLabel} – ${endLabel}`,
      startEpoch: slotStart,
      endEpoch: slotEnd,
      startLabel,
      endLabel,
    };
  });

  return {
    slots,
    totalHours,
    pickupLabel: epochToTimeLabel(pickupEpoch),
    dropOffLabel: epochToTimeLabel(dropOffEpoch),
  };
}
