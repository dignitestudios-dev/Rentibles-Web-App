"use client";
import React from "react";

interface RentalsTabsProps {
  activeTab: "customer_rental" | "my_rentals";
  onChange: (tab: "customer_rental" | "my_rentals") => void;
}

const RentalsTabs: React.FC<RentalsTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div>
      <div className="m-2 border-2 rounded-2xl">
        <div className="flex m-1">
          <button
            onClick={() => onChange("customer_rental")}
            className={`flex-1 px-6 py-4 text-sm cursor-pointer font-semibold transition-all ${
              activeTab === "customer_rental"
                ? "bg-primary text-white rounded-l-xl"
                : "border-b-transparent text-gray-600 dark:text-gray-400 hover:text-foreground rounded-l-xl"
            }`}
          >
            Customer Rentals
          </button>

          <button
            onClick={() => onChange("my_rentals")}
            className={`flex-1 px-6 py-4 text-sm  cursor-pointer font-semibold transition-all ${
              activeTab === "my_rentals"
                ? "bg-primary text-white rounded-r-xl"
                : "border-b-transparent text-gray-600 dark:text-gray-400 hover:text-foreground rounded-r-xl"
            }`}
          >
            My Rentals
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalsTabs;
