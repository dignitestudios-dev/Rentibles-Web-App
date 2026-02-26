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
  typeDebit: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  typeCredit: {
    color: "#22c55e",
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

interface Transaction {
  _id: string;
  shortCode?: string;
  productName?: string;
  amount: number;
  reason?: string;
  card?: {
    brand: string;
    last4: string;
  };
  type: "debit" | "credit";
  date: number;
}

interface TransactionsPDFProps {
  transactions: Transaction[];
  currency?: string;
}

const getTypeStyle = (type: string) => {
  if (type === "debit") return styles.typeDebit;
  if (type === "credit") return styles.typeCredit;
  return { color: "#374151" };
};

const TransactionsPDF: React.FC<TransactionsPDFProps> = ({
  transactions,
  currency = "USD",
}) => {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const creditAmount = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const debitAmount = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
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
          <Text style={styles.headerSubtitle}>Transaction Report</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Report Generated:</Text>
            <Text style={styles.summaryValue}>{formattedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Transactions:</Text>
            <Text style={styles.summaryValue}>{transactions.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>
              ${totalAmount.toFixed(2)} {currency}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Credit Amount:</Text>
            <Text style={{ ...styles.summaryValue, color: "#22c55e" }}>
              +${creditAmount.toFixed(2)} {currency}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Debit Amount:</Text>
            <Text style={{ ...styles.summaryValue, color: "#ef4444" }}>
              -${debitAmount.toFixed(2)} {currency}
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
              Transaction ID
            </Text>
            <Text
              style={{
                ...styles.tableCell,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Product
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
              Type
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
          </View>

          {/* Table Rows */}
          {transactions.map((transaction, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {transaction.shortCode || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {transaction.productName || "N/A"}
              </Text>
              <Text style={{ ...styles.tableCell, textAlign: "center" }}>
                ${transaction.amount.toFixed(2)}
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  ...getTypeStyle(transaction.type),
                }}
              >
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </Text>
              <Text style={{ ...styles.tableCell, textAlign: "center" }}>
                {new Date(transaction.date * 1000).toLocaleDateString("en-US")}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

/**
 * Generate and download transactions PDF report
 * @param transactions - Array of transaction records to include in the PDF
 * @param currency - Currency code (default: USD)
 * @throws Error if PDF generation fails
 */
export const generateTransactionPDF = async (
  transactions: Transaction[],
  currency: string = "USD",
): Promise<void> => {
  const filename = `transaction-report-${new Date().getTime()}.pdf`;

  try {
    if (!transactions || transactions.length === 0) {
      throw new Error("No transaction data available to generate PDF");
    }

    const pdfBlob = await pdf(
      <TransactionsPDF transactions={transactions} currency={currency} />,
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
    throw new Error("Failed to generate transaction PDF");
  }
};
