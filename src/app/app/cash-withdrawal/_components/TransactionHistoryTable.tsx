import React from "react";

import { ChevronRight } from "lucide-react";
import { TransactionRecord } from "@/src/types/index.type";

interface TransactionHistoryTableProps {
  data: TransactionRecord[];
  handleRowClick: (record: TransactionRecord) => void;
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  data,
  handleRowClick,
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No transaction history found</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="">
          <th className="text-left py-4 px-4 text-sm font-semibold text-foreground/70">
            Code
          </th>
          <th className="text-left py-4 px-4 text-sm font-semibold text-foreground/70">
            Product Name
          </th>
          <th className="text-right py-4 px-0 text-sm font-semibold text-foreground/70">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((record) => (
          <tr key={record.id} className="">
            <td className="py-4 px-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">
                  {/* {formatDate(record.date)} */}
                  {/* {formatDateToMMDDYYYY(record.date)} */}
                  {record.shortCode}
                </span>
              </div>
            </td>
            <td className="py-4 px-4">
              <span className={`inline-flex items-center text-sm  `}>
                {/* {record.status} */}
                {record.productName}
              </span>
            </td>
            <td className="py-4 px-2 text-sm font-semibold text-right">
              <span
                className={
                  record.type === "credit" ? "text-green-500" : "text-primary"
                }
              >
                {record.type === "credit" ? "+" : "-"}
                {/* {formatCurrency(record.amount)} */}${record.amount}
              </span>
            </td>
            <td
              onClick={() => handleRowClick(record)}
              className="py-4 px-1 text-sm font-semibold text-right cursor-pointer"
            >
              <span>
                <ChevronRight />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionHistoryTable;
