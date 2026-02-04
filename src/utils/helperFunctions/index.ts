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
