import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { WithdrawalDetails } from "@/src/types/index.type";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#f85e00", // blue-500
    color: "white",
    padding: 20,
    marginBottom: 30,
    textAlign: "center",
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "normal",
  },
  statusBadge: {
    backgroundColor: "#22c55e", // green-500
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 20,
    width: 180,
    marginLeft: "auto",
    marginRight: "auto",
  },
  amountSection: {
    backgroundColor: "#f3f4f6", // gray-100
    padding: 20,
    marginBottom: 30,
    borderRadius: 4,
  },
  amountLabel: {
    fontSize: 11,
    color: "#374151", // gray-700
    marginBottom: 10,
    fontWeight: "normal",
  },
  amountValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f85e00", // orange-500
    textAlign: "center",
  },
  detailsSection: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb", // gray-200
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: "#374151", // gray-700
    fontWeight: "normal",
  },
  detailValue: {
    fontSize: 10,
    color: "#374151", // gray-700
    fontWeight: "bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db", // gray-300
    marginBottom: 20,
  },
  descriptionSection: {
    marginBottom: 30,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151", // gray-700
  },
  descriptionText: {
    fontSize: 9,
    color: "#374151", // gray-700
    lineHeight: 1.5,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#d1d5db", // gray-300
    paddingTop: 15,
    marginTop: 30,
    fontSize: 8,
    color: "#999999",
    textAlign: "center",
  },
  footerText: {
    marginBottom: 5,
  },
});

// PDF Component
interface WithdrawalPDFProps {
  details: WithdrawalDetails;
}

const WithdrawalPDF: React.FC<WithdrawalPDFProps> = ({ details }) => {
  // Format date
  const formattedDate = new Date(details.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Current timestamp
  const timestamp = new Date().toLocaleString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rentibles</Text>
          <Text style={styles.headerSubtitle}>Withdrawal Receipt</Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text>✓ COMPLETED</Text>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Withdrawal Amount</Text>
          <Text style={styles.amountValue}>${details.amount.toFixed(2)}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Reference ID */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference ID:</Text>
            <Text style={styles.detailValue}>{details.referenceId}</Text>
          </View>

          {/* Currency */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Currency:</Text>
            <Text style={styles.detailValue}>
              {details.currency.toUpperCase()}
            </Text>
          </View>

          {/* Date & Time */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>

          {/* Status */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>Completed</Text>
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Description/Notes Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{details.description}</Text>
        </View>

        {/* Footer Section */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is an automated receipt for your withdrawal. Please keep this
            for your records.
          </Text>
          <Text style={styles.footerText}>Downloaded on: {timestamp}</Text>
          <Text style={styles.footerText}>
            © 2026 Rentibles. All rights reserved.
          </Text>
        </View> */}
      </Page>
    </Document>
  );
};

/**
 * Generate and download a withdrawal PDF receipt
 * @param details - Withdrawal details to include in the PDF
 * @throws Error if PDF generation fails
 */
export const generateWithdrawalPDF = async (
  details: WithdrawalDetails,
): Promise<void> => {
  const filename = `withdrawal-receipt-${details.referenceId}-${new Date().getTime()}.pdf`;

  try {
    // ✅ FIX 1: Pass a single ReactElement, not an array
    // ✅ FIX 2: Use toBlob() to get the PDF blob
    const pdfBlob = await pdf(<WithdrawalPDF details={details} />).toBlob();

    // Create a temporary URL for the blob
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate withdrawal PDF");
  }
};
