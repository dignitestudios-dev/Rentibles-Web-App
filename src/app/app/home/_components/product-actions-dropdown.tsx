"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useToggleProductActivation,
  useDeleteProduct,
} from "@/src/lib/api/products";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";

type Product = {
  _id?: string;
  name?: string;
  cover?: string;
  category?: { name?: string };
  pricePerDay?: number;
  pricePerHour?: number;
  productReview?: number;
  isLiked?: boolean;
  isActive?: boolean;
};

interface Props {
  product: Product;
}

export function ProductActionsDropdown({ product }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ✅ Delete mutation (using shared hook)
  const deleteMutation = useDeleteProduct();

  // ✅ Toggle activation mutation
  const toggleActivationMutation = useToggleProductActivation();

  const handleToggleActivation = () => {
    if (!product._id) return;
    toggleActivationMutation.mutate(
      {
        productId: product._id,
        isActive: !product.isActive,
      },
      {
        onSuccess: () => {
          SuccessToast("Product status updated");
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (err) => {
          const message = getAxiosErrorMessage(
            err || "Failed to update product status",
          );
          ErrorToast(message);
        },
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="absolute top-3 right-3 bg-accent rounded-md p-1 shadow hover:bg-muted z-50">
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {/* Edit */}
        <DropdownMenuItem
          onClick={() => router.push(`/app/products/edit/${product._id}`)}
        >
          Edit Product
        </DropdownMenuItem>

        {/* Toggle */}
        <DropdownMenuItem
          onClick={handleToggleActivation}
          disabled={toggleActivationMutation.isPending}
        >
          {product.isActive ? "Disable Product" : "Enable Product"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={(e) => e.preventDefault()} // prevents dropdown close glitch
            >
              Delete Product
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!product._id) return;
                  deleteMutation.mutate(
                    { productId: product._id },
                    {
                      onSuccess: () => {
                        SuccessToast("Product deleted");
                        queryClient.invalidateQueries({
                          queryKey: ["products"],
                        });
                      },
                      onError: (err) => {
                        const message = getAxiosErrorMessage(
                          err || "Failed to delete product",
                        );
                        ErrorToast(message);
                      },
                    },
                  );
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
