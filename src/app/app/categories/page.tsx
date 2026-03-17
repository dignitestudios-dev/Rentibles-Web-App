"use client";
import { Suspense } from "react";
import CategoriesContent from "./CategoriesContent";
import Loader from "@/src/components/common/Loader";

const CategoriesPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader show={true} />
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
};

export default CategoriesPage;
