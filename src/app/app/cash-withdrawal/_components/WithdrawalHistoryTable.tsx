// components/WithdrawalHistoryTable.tsx
import {
  TransactionRecord,
  TransactionStatus,
  WithdrawalRecord,
} from "@/src/types/index.type";
import { formatDateToMMDDYYYY } from "@/src/utils/helperFunctions";
import { ChevronRight, FileDown, Funnel } from "lucide-react";
import React, { useState } from "react";
// import { formatDate, formatCurrency } from '../utils/formatters';

interface WithdrawalHistoryTableProps {
  data: WithdrawalRecord[];
  handleRowClick: (record: TransactionRecord) => void;
}

const WithdrawalHistoryTable: React.FC<WithdrawalHistoryTableProps> = ({
  data,
  handleRowClick,
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No withdrawal history found</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="">
          <th className="text-left py-4 px-4 text-sm font-semibold text-foreground/70">
            Date
          </th>
          <th className="text-left py-4 px-4 text-sm font-semibold text-foreground/70">
            Status
          </th>
          <th className="text-right  py-4 px-0 text-sm font-semibold text-foreground/70">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((record) => (
          <tr key={record.id} className=" ">
            <td className="py-4 px-4 text-sm text-foreground">
              {formatDateToMMDDYYYY(record.date)}
            </td>
            <td className="py-4 px-4">
              <span className={`inline-flex items-center text-sm `}>
                {record.status}
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

export default WithdrawalHistoryTable;
