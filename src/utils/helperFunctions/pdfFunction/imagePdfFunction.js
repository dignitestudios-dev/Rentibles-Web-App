import {
  agreement_one,
  agreement_two,
  agreement_three,
  agreement_four,
  agreement_five,
  agreement_six,
} from "@/public/images/export";
import { jsPDF } from "jspdf";
import {
  getBookingDateTimeString,
  getReturnDateTimeString,
  getTotalAmountString,
} from "./rentalPDFUtils";
import { formatDateToMMDDYYYY } from "../index.ts";
import { rochesterBase64 } from "./rochesterBase64";

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // If using Next.js, imported images are objects. We need the .src string.
    const src = typeof url === "string" ? url : url.src;

    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

export const generateAgreementPdf = async (
  data = {},
  isTracking = false,
  isSeller = false,
  isOrder = false,
) => {
  const bookingDateTime = getBookingDateTimeString(
    data.selectionMode,
    data.dateRange,
    data.timeSlots,
    data.pickupTime,
    data.dropOffTime,
  );
  const returnDateTime = getReturnDateTimeString(
    data.selectionMode,
    data.dateRange,
    data.timeSlots,
    data.dropOffTime,
  );
  const totalAmount = getTotalAmountString(
    data.selectionMode,
    data.dateRange,
    data.timeSlots,
    data.quantity,
    data.dailyPrice,
    data.hourlyPrice,
  );
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
  });

  doc.addFileToVFS("Rochester-Regular.ttf", rochesterBase64);
  doc.addFont("Rochester-Regular.ttf", "Rochester", "normal");

  const PW = 595;
  const PH = 842;

  // Ensure this list has 6 images to match your logic
  const imagePaths = [
    agreement_one,
    agreement_six, // Do not change position its actually a page 2
    agreement_two,
    agreement_three,
    agreement_four,
    agreement_five,
  ];

  try {
    const images = await Promise.all(imagePaths.map((path) => loadImage(path)));

    // 1. Draw first 5 pages (Indices 0, 1, 2, 3, 4)
    for (let i = 0; i < 5; i++) {
      if (i > 0) doc.addPage();
      doc.addImage(images[i], "JPEG", 0, 0, PW, PH);
    }

    // 2. Draw LAST PAGE (Index 5)
    doc.addPage();
    doc.addImage(images[5], "JPEG", 0, 0, PW, PH);

    // --- Data Overlays ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // Coordinates (Adjust Y slightly if text looks too high)
    doc.text(String(data.itemName || ""), 150, 170);
    doc.text(String(isOrder ? "" : isSeller ? "" : data.code || ""), 205, 200);
    doc.text(
      String(isOrder ? "" : isSeller ? "" : data.quantity || ""),
      140,
      229,
    );
    doc.text(
      String(
        isOrder
          ? ""
          : isSeller
            ? ""
            : isTracking
              ? new Date(data.pickupTime * 1000).toLocaleDateString() +
                "- " +
                new Date(data.pickupTime * 1000).toLocaleTimeString()
              : bookingDateTime || "",
      ),
      200,
      257,
    );
    doc.text(
      String(
        isOrder
          ? ""
          : isSeller
            ? ""
            : isTracking
              ? new Date(data.dropOffTime * 1000).toLocaleDateString() +
                "- " +
                new Date(data.dropOffTime * 1000).toLocaleTimeString()
              : returnDateTime || "",
      ),
      200,
      283,
    );
    doc.text(
      String(
        isOrder
          ? ""
          : isSeller
            ? ""
            : isTracking
              ? data.totalAmount
              : totalAmount || "",
      ),
      160,
      315,
    );

    doc.text(String(data.renterName || ""), 165, 394);
    doc.text(String(data.ownerName || ""), 410, 394);
    // doc.setFont("Rochester", "normal"); // Switch to Rochester
    // doc.setFontSize(16);
    doc.text(String(data.renterSign || ""), 180, 443);
    doc.text(String(data.ownerSign || ""), 390, 443);
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(11);
    doc.text(
      String(
        data.signDateRenter ? formatDateToMMDDYYYY(data.signDateRenter) : "",
      ),
      115,
      498,
    );
    doc.text(
      String(
        data.signDateOwner ? formatDateToMMDDYYYY(data.signDateOwner) : "",
      ),
      330,
      498,
    );

    // doc.save("policy_agreement.pdf");
    const blob = doc.output("blob");

    // 2. Create a temporary URL for that Blob
    const blobUrl = URL.createObjectURL(blob);

    // 3. Return it so your component can use it
    return blobUrl;
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
