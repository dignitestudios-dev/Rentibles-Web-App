"use client";

import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

const ProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;
