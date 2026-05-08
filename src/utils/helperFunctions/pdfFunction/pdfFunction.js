// ============================================================
// generateRentalPolicyPDF.js
//
// Usage:
//   import { generateRentalPolicyPDF } from "./generateRentalPolicyPDF";
//
//   generateRentalPolicyPDF({
//     itemName:      "Canon EOS R5",
//     shortCode:     "ORD-00123",
//     quantity:      "1",
//     bookingDate:   "Jan 10, 2025 – 10:00 AM",
//     returnDate:    "Jan 15, 2025 – 10:00 AM",
//     totalAmount:   "$250.00",
//     renterName:    "John Doe",
//   });
//
// Requires: jsPDF  →  npm install jspdf
// generateRentalPolicyPDF({
//                       name: product.name,
//                       pickupTime: product.pickupTime,
//                       dropOffTime: product?.dropOffTime,
//                       quantity: product.quantity,
//                       productId: product._id,
//                       selectionMode: selectionMode,
//                       dateRange,
//                       timeSlots,
//                       hourlyPrice: product.pricePerHour,
//                       dailyPrice: product.pricePerDay,
//                       renterName: user?.name || "Renter",
//                       ownerName: product.user?.name || "Owner",
//                     });
// ============================================================

import { jsPDF } from "jspdf";
import {
  getBookingDateTimeString,
  getReturnDateTimeString,
  getTotalAmountString,
} from "./rentalPDFUtils";
import { formatDateToMMDDYYYY } from "..";

/**
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.productId       - Order ID
 * @param {number} data.quantity
 * @param {number} data.pickupTime
 * @param {number} data.dropOffTime
 * @param {number} data.hourlyPrice
 * @param {number} data.dailyPrice
 * @param {string} data.renterName
 * @param {"day"|"hour"|null} data.selectionMode
 * @param {{ from?: Date | undefined; to?: Date | undefined; } | undefined} data.dateRange
 * @param {Array<{ startEpoch: number; endEpoch: number; }>} data.timeSlots
 * @param {string} data.ownerName
 */

export const generateRentalPolicyPDF = (data = {}) => {
  const {
    name = "",
    _id = "",
    quantity = 1,
    pickupTime,
    dropOffTime,
    hourlyPrice,
    dailyPrice,
    selectionMode,
    dateRange,
    timeSlots = [],
    renterName = "",
    ownerName = "",
  } = data;
  console.log("<====PDF data===> ", data);
  const bookingDateTime = getBookingDateTimeString(
    selectionMode,
    dateRange,
    timeSlots,
    pickupTime,
    dropOffTime,
  );
  const returnDateTime = getReturnDateTimeString(
    selectionMode,
    dateRange,
    timeSlots,
    dropOffTime,
  );
  const totalAmount = getTotalAmountString(
    selectionMode,
    dateRange,
    timeSlots,
    quantity,
    dailyPrice,
    hourlyPrice,
  );

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const PW = doc.internal.pageSize.getWidth(); // 612
  const PH = doc.internal.pageSize.getHeight(); // 792
  const ML = 60; // left margin
  const MR = PW - 60; // right edge
  const CW = MR - ML; // content width

  // ── Colours ─────────────────────────────────────────────────
  const ORANGE = [230, 80, 0];
  const GRAY = [120, 120, 120];
  const BLACK = [30, 30, 30];
  const WHITE = [255, 255, 255];
  const LGRAY = [200, 200, 200];

  // ── Helpers ──────────────────────────────────────────────────
  const v = (s) => (s && String(s).trim() !== "" ? String(s) : "");

  const fillRect = (x, y, w, h, rgb) => {
    doc.setFillColor(...rgb);
    doc.rect(x, y, w, h, "F");
  };

  // Draw a horizontal underline field
  // Returns the y after the field
  const drawField = (label, value, x, y, lineW, labelBold = true) => {
    doc.setFont("helvetica", labelBold ? "bold" : "normal");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(label, x, y);

    const labelW = doc.getTextWidth(label);
    const lineX = x + labelW + 4;
    const lineY = y + 2;

    // Underline
    doc.setDrawColor(...LGRAY);
    doc.setLineWidth(0.8);
    doc.line(lineX, lineY, lineX + lineW, lineY);

    // Value text (if provided)
    if (value) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(v(value), lineX + 4, y);
    }

    return y + 22;
  };

  // Draw a bullet point (•) with wrapped text, returns new y
  const drawBullet = (text, x, y, maxW, fontSize = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...BLACK);
    doc.text("•", x, y);
    const lines = doc.splitTextToSize(text, maxW - 14);
    doc.text(lines, x + 14, y);
    return y + lines.length * (fontSize * 1.4) + 4;
  };

  // Wrapped paragraph, returns new y
  const drawPara = (
    text,
    x,
    y,
    maxW,
    fontSize = 10,
    bold = false,
    color = BLACK,
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxW);
    doc.text(lines, x, y);
    return y + lines.length * (fontSize * 1.45);
  };

  // ════════════════════════════════════════════════════════════
  // HEADER  — gray chevron left + orange bar right
  // ════════════════════════════════════════════════════════════
  const HDR_H = 52;

  // Full orange top bar
  fillRect(0, 0, PW, HDR_H, ORANGE);

  // Gray chevron (left overlay)
  doc.setFillColor(...GRAY);
  doc.triangle(0, 0, 200, 0, 160, HDR_H, "F");
  doc.setFillColor(...GRAY);
  // second triangle to make the chevron tail shape
  doc.triangle(0, 0, 0, HDR_H, 160, HDR_H, "F");

  // "R" logo white box
  //   fillRect(14, 8, 36, 36, WHITE);
  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(22);
  //   doc.setTextColor(...GRAY);
  //   doc.text("R", 22, 33);

  // Small white diagonal accent (right of logo box)
  //   doc.setFillColor(...WHITE);
  //   doc.triangle(52, 8, 68, 8, 52, 44, "F");

  // ════════════════════════════════════════════════════════════
  // BODY — cursor starts after header
  // ════════════════════════════════════════════════════════════
  let y = HDR_H + 36;

  // ── Section 1: Acknowledgment ────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BLACK);
  doc.text("Acknowledgment and Signature", ML, y);
  y += 18;

  y = drawPara(
    "By signing this Rental Policy, you acknowledge that you have read, understood, and agree to comply with the terms set forth above.",
    ML,
    y,
    CW,
    10,
  );
  y += 8;

  y = drawBullet(
    "Renters: You understand that you are responsible for maintaining the rented item, returning it in good condition, and covering any applicable costs for damage, loss, or late returns.",
    ML + 4,
    y,
    CW - 4,
    10,
  );
  y += 4;

  y = drawBullet(
    "Lenders: You understand that you are responsible for providing accurate descriptions, ensuring the item is in proper working condition, and addressing any issues or disputes related to your listed item in a timely manner.",
    ML + 4,
    y,
    CW - 4,
    10,
  );
  y += 24;

  // ── Section 2: Item / Booking Details ───────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BLACK);
  doc.text("Item/Booking Details", ML, y);
  y += 16;

  y = drawPara(
    "The following section specifies the item being rented, along with relevant booking and return details:",
    ML,
    y,
    CW,
    10,
    true,
  );
  y += 18;

  // Fields
  y = drawField("Item Name:", v(name), ML, y, 260);
  y += 4;
  y = drawField("Short Code (Order ID)", v(_id), ML, y, 200);
  y += 4;
  y = drawField("Quantity:", v(quantity), ML, y, 200);
  y += 4;
  y = drawField("Booking Date & Time:", v(bookingDateTime), ML, y, 200);
  y += 4;
  y = drawField("Return Date & Time:", v(returnDateTime), ML, y, 200);
  y += 4;
  y = drawField("Total Amount:", v(totalAmount), ML, y, 220);
  y += 20;

  // Agreement text
  y = drawPara(
    "Both parties agree to adhere to the terms of this policy to ensure a transparent and fair rental experience.",
    ML,
    y,
    CW,
    10,
    true,
  );
  y += 24;

  // ── Signature block ──────────────────────────────────────────
  const LEFT_X = ML;
  const RIGHT_X = PW / 2 + 10;
  const LINE_W = 180;

  // Names row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);
  doc.text("Renter's Name:", LEFT_X, y);
  doc.setDrawColor(...LGRAY);
  doc.setLineWidth(0.8);
  const rnLabelW = doc.getTextWidth("Renter's Name:") + 6;
  doc.line(LEFT_X + rnLabelW, y + 2, LEFT_X + rnLabelW + LINE_W, y + 2);
  if (v(renterName)) {
    doc.setFont("helvetica", "normal");
    doc.text(v(renterName), LEFT_X + rnLabelW + 4, y);
  }

  doc.setFont("helvetica", "bold");
  doc.text("Lender/Store's Name:", RIGHT_X, y);
  const lnLabelW = doc.getTextWidth("Lender/Store's Name:") + 6;
  doc.line(RIGHT_X + lnLabelW, y + 2, RIGHT_X + lnLabelW + LINE_W, y + 2);
  if (v(ownerName)) {
    doc.setFont("helvetica", "normal");
    doc.text(v(ownerName), RIGHT_X + lnLabelW + 4, y);
  }
  y += 36;

  // Signatures row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);
  doc.text("Renter's Signature:", LEFT_X, y);
  const rsSigW = doc.getTextWidth("Renter's Signature:") + 4;
  doc.setDrawColor(...LGRAY);
  doc.line(LEFT_X + rsSigW, y + 2, LEFT_X + rsSigW + LINE_W, y + 2);

  doc.text("Lender's Signature:", RIGHT_X, y);
  const lsSigW = doc.getTextWidth("Lender's Signature:") + 4;
  doc.line(RIGHT_X + lsSigW, y + 2, RIGHT_X + lsSigW + LINE_W, y + 2);
  y += 36;

  // Date row
  doc.text("Date:", LEFT_X, y);
  const dateLW = doc.getTextWidth("Date:") + 4;
  doc.line(LEFT_X + dateLW, y + 2, LEFT_X + dateLW + 140, y + 2);
  doc.setFont("helvetica", "normal");
  doc.text(v(formatDateToMMDDYYYY(new Date())), LEFT_X + rnLabelW + 4, y);

  doc.text("Date:", RIGHT_X, y);
  doc.line(RIGHT_X + dateLW, y + 2, RIGHT_X + dateLW + 140, y + 2);
  doc.setFont("helvetica", "normal");
  doc.text(v(formatDateToMMDDYYYY(new Date())), RIGHT_X + lnLabelW + 4, y);
  y += 40;

  // ── Footer contact block ─────────────────────────────────────
  // Push toward bottom if there's room
  const footerContentH = 80;
  const footerStartY = Math.max(y + 20, PH - 160 - footerContentH);

  y = footerStartY;

  y = drawPara(
    "For any questions or concerns, please write Rentibles at:",
    ML,
    y,
    CW,
    10,
    true,
  );
  y += 2;

  y = drawBullet("Email: info@rentibles.com", ML + 4, y, CW - 4, 10);
  y = drawBullet(
    "Address: Rentibles LLC 382 NE 191ST ST NUM 857346, Miami, FL 33179",
    ML + 4,
    y,
    CW - 4,
    10,
  );
  y += 14;

  y = drawPara(
    "By agreeing to this policy, you ensure a respectful, responsible, and successful rental experience with Rentibles.",
    ML,
    y,
    CW,
    10,
  );

  // ════════════════════════════════════════════════════════════
  // FOOTER  — matching the template: gray chevron left + orange right
  // ════════════════════════════════════════════════════════════
  const FTR_H = 44;
  const FTR_Y = PH - FTR_H;

  // Orange right block
  fillRect(0, FTR_Y, PW, FTR_H, ORANGE);

  // Gray chevron (left overlay)
  doc.setFillColor(...GRAY);
  doc.triangle(0, FTR_Y, 220, FTR_Y, 180, PH, "F");
  doc.triangle(0, FTR_Y, 0, PH, 180, PH, "F");

  // Orange accent chevron (right area, like the template)
  doc.setFillColor(...ORANGE);
  doc.triangle(PW - 180, FTR_Y, PW, FTR_Y, PW, PH, "F");
  doc.triangle(PW - 180, FTR_Y, PW - 220, PH, PW, PH, "F");

  // ── Save ─────────────────────────────────────────────────────
  doc.save("Rental_Policy_Rentibles.pdf");
};
