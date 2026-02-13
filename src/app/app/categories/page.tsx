"use client";
import { Suspense } from "react";
import CategoriesContent from "./CategoriesContent";

const CategoriesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
};

export default CategoriesPage;
