"use client";

import { Suspense } from "react";
import CategoriesContent from "./CategoriesContent";

const Categories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
};

export default Categories;
