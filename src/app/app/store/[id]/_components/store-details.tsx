"use client";

import { Suspense } from "react";
import StoreDetailsContent from "./StoreDetailsContent";

const StoreDetails = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreDetailsContent />
    </Suspense>
  );
};

export default StoreDetails;
