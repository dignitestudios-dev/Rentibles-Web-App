"use client";

import { Suspense } from "react";
import ProductsContent from "./ProductsContent";
import Loader from "@/src/components/common/Loader";

const ProductsPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader show={true} />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;
