import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#f85e00",
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
  summarySection: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    marginBottom: 30,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "normal",
  },
  summaryValue: {
    fontSize: 11,
    color: "#f85e00",
    fontWeight: "bold",
  },
  tableSection: {
    marginBottom: 30,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#374151",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f85e00",
    color: "white",
    padding: 10,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    padding: 10,
    fontSize: 9,
  },
  tableCell: {
    flex: 1,
    color: "#374151",
  },
  statusCompleted: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  statusPending: {
    color: "#f59e0b",
    fontWeight: "bold",
  },
  statusFailed: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
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

interface Payout {
  _id: string;
  amount: number;
  date: number;
  status: string;
  currency?: string;
}

interface PayoutsPDFProps {
  payouts: Payout[];
  currency?: string;
}

const getStatusColor = (status: string) => {
  if (status === "completed") return styles.statusCompleted;
  if (status === "pending") return styles.statusPending;
  if (status === "failed") return styles.statusFailed;
  return { color: "#374151" };
};

const PayoutsPDF: React.FC<PayoutsPDFProps> = ({
  payouts,
  currency = "USD",
}) => {
  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rentibles</Text>
          <Text style={styles.headerSubtitle}>Payouts & Withdrawal Report</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Report Generated:</Text>
            <Text style={styles.summaryValue}>{formattedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Transactions:</Text>
            <Text style={styles.summaryValue}>{payouts.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>
              ${totalAmount.toFixed(2)} {currency}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed Amount:</Text>
            <Text style={styles.summaryValue}>
              ${completedAmount.toFixed(2)} {currency}
            </Text>
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>Transaction Details</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text
              style={{
                ...styles.tableCell,
                fontWeight: "bold",
                color: "white",
              }}
            >
              ID
            </Text>
            <Text
              style={{
                ...styles.tableCell,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                ...styles.tableCell,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Date
            </Text>
            <Text
              style={{
                ...styles.tableCell,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Status
            </Text>
          </View>

          {/* Table Rows */}
          {payouts.map((payout, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{payout._id.substring(0, 8)}</Text>
              <Text style={{ ...styles.tableCell, textAlign: "center" }}>
                ${payout.amount.toFixed(2)}
              </Text>
              <Text style={{ ...styles.tableCell, textAlign: "center" }}>
                {new Date(payout.date * 1000).toLocaleDateString("en-US")}
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  ...getStatusColor(payout.status),
                }}
              >
                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer Section */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is an automated report for your payouts and withdrawals.
          </Text>
          <Text style={styles.footerText}>
            Generated on: {new Date().toLocaleString()}
          </Text>
          <Text style={styles.footerText}>
            © 2026 Rentibles. All rights reserved.
          </Text>
        </View> */}
      </Page>
    </Document>
  );
};

/**
 * Generate and download payouts PDF report
 * @param payouts - Array of payout records to include in the PDF
 * @param currency - Currency code (default: USD)
 * @throws Error if PDF generation fails
 */
export const generatePayoutsPDF = async (
  payouts: Payout[],
  currency: string = "USD",
): Promise<void> => {
  const filename = `payouts-report-${new Date().getTime()}.pdf`;

  try {
    if (!payouts || payouts.length === 0) {
      throw new Error("No payouts data available to generate PDF");
    }

    const pdfBlob = await pdf(
      <PayoutsPDF payouts={payouts} currency={currency} />,
    ).toBlob();

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
    throw new Error("Failed to generate payouts PDF");
  }
};
