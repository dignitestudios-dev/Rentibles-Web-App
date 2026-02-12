"use client";
import React, { useState } from "react";

const RentalsTabs = () => {
  const [activeTab, setActiveTab] = useState("customer_rental");
  return (
    <div>
      <div className="m-2 border-2 rounded-2xl">
        <div className="flex m-1">
          <button
            onClick={() => setActiveTab("customer_rental")}
            className={`flex-1 px-6 py-4 text-sm cursor-pointer font-semibold transition-all ${
              activeTab === "customer_rental"
                ? "bg-primary text-white rounded-l-xl"
                : "text-foreground hover:text-gray-900 hover:bg-gray-50 rounded-l-xl"
            }`}
          >
            Customer Rentals
          </button>
          <button
            onClick={() => setActiveTab("my_rentals")}
            className={`flex-1 px-6 py-4 text-sm  cursor-pointer font-semibold transition-all ${
              activeTab === "my_rentals"
                ? "bg-primary text-white rounded-r-xl"
                : "text-foreground hover:text-gray-900 hover:bg-gray-50 rounded-r-xl"
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
