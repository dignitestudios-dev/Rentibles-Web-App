"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import ProductRequestCard from "./_components/ProductRequestCard";
import AddProductRequestModal from "./_components/AddProductRequestModal";

import { mockCategories, mockProductRequests } from "./_components/mockData";
import {
  AddProductRequestFormData,
  ProductRequest,
} from "@/src/types/index.type";
import { useRouter } from "next/navigation";

const ProductRequestsScreen: React.FC = () => {
  const router = useRouter();
  const [productRequests, setProductRequests] =
    useState<ProductRequest[]>(mockProductRequests);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDeleteRequest = (id: string) => {
    setProductRequests((prev) => prev.filter((request) => request.id !== id));
  };

  const handleAddRequest = (data: AddProductRequestFormData) => {
    const selectedCategory = mockCategories.find(
      (cat) => cat.id === data.categoryId,
    );

    if (!selectedCategory) return;

    const newRequest: ProductRequest = {
      id: `req-${Date.now()}`,
      productName: data.productName,
      description: data.description,
      storeName: "Pending Assignment",
      category: selectedCategory,
      createdAt: new Date(),
      status: "pending",
    };

    setProductRequests((prev) => [newRequest, ...prev]);

    // Show success message
    alert(`Product request "${data.productName}" has been added successfully!`);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Product Requests</h1>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary transition-all active:scale-95 shadow-md hover:shadow-md"
            >
              {/* <Plus className="w-5 h-5" /> */}
              Add Request
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Product Requests Grid */}
        {productRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Product Requests
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first product request
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productRequests.map((request) => (
              <ProductRequestCard
                key={request.id}
                request={request}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Request Modal */}
      <AddProductRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={mockCategories}
        onSubmit={handleAddRequest}
      />
    </div>
  );
};

export default ProductRequestsScreen;
