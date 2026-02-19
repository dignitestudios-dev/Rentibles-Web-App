"use client";

import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useProductRequests,
  useDeleteProductRequest,
} from "@/src/lib/api/productRequests";
import Loader from "@/src/components/common/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";

const ProductRequestsScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useProductRequests();
  const deleteProductRequestMutation = useDeleteProductRequest();
  const productRequests = data?.data ?? [];

  const handleDelete = async (id: string) => {
    try {
      await deleteProductRequestMutation.mutateAsync(id);
      SuccessToast("Product request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["productRequests"] });
    } catch (error) {
      const message = getAxiosErrorMessage(
        error,
        "Failed to delete product request",
      );
      ErrorToast(message);
    }
  };

  return (
    <div className="bg-background flex flex-col">
      <Loader show={isLoading || deleteProductRequestMutation.isPending} />
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/app/home"
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Product Requests
          </h1>
          <Link href="/app/product-request/add" legacyBehavior>
            <a className="w-full md:w-auto">
              <button className="w-full md:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-md">
                Add Request
              </button>
            </a>
          </Link>
        </div>
      </div>

      {/* Requests List */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8">
        {productRequests.length === 0 ? (
          <div className="bg-card rounded-xl shadow-md p-12 text-center border border-border w-full max-w-md mt-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Product Requests
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first product request
            </p>
            <Link href="/app/product-request/add" legacyBehavior>
              <a>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all">
                  <Plus className="w-5 h-5" />
                  Add Request
                </button>
              </a>
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-xl flex flex-col gap-4">
            {productRequests.map((request) => (
              <div
                key={request._id}
                className="bg-card rounded-xl p-5 flex items-center justify-between shadow border border-border"
              >
                <div>
                  <div className="text-lg font-bold text-foreground mb-1">
                    {request.name}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {request.category?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {request.description}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(request._id)}
                  className="ml-4 p-2 rounded-full bg-destructive/90 hover:bg-destructive transition-colors"
                  disabled={deleteProductRequestMutation.isPending}
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Request Button (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background px-4 py-4 border-t border-border md:hidden">
        <Link href="/app/product-request/add" legacyBehavior>
          <a>
            <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95">
              Add Request
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ProductRequestsScreen;
