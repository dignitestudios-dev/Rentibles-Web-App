"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import UpdateProductForm from "../../../create-product/_component/UpdateProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = typeof params?.id === "string" ? params.id : undefined;
  const router = useRouter();

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Missing product id</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <UpdateProductForm productId={productId} />
    </div>
  );
}
