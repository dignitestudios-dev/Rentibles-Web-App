"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCategories } from "@/src/lib/api/products";
import { useCreateProductRequest } from "@/src/lib/api/productRequests";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import Loader from "@/src/components/common/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  categoryId: z
    .string({ message: "Category is required!" })
    .min(1, "Category is required!"),
  productName: z.string().min(1, "Product name is required!"),
  description: z.string().min(1, "Product description is required!"),
});

export default function AddProductRequest() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useCategories();
  const createProductRequestMutation = useCreateProductRequest();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: "",
      productName: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createProductRequestMutation.mutateAsync({
        name: data.productName,
        description: data.description,
        categoryId: data.categoryId,
      });
      SuccessToast("Product request created successfully");
      setShowSuccess(true);
      reset();
      queryClient.invalidateQueries({ queryKey: ["productRequests"] });
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to create product request");
      ErrorToast(message);
    }
  };

  const isLoading = createProductRequestMutation.isPending || isCategoriesLoading;
  const categories = categoriesResponse?.data ?? [];

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/app/product-request");
  };

  return (
    <div className="bg-background flex flex-col">
      <Loader show={isLoading} />
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border flex items-center px-4 py-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-md transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground mx-auto">
          Product Requests
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col justify-start items-center px-4 pt-8"
        id="product-request-form"
      >
        <div className="w-full max-w-md space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Category
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={showSuccess || isCategoriesLoading}
                >
                  <SelectTrigger
                    className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 disabled:opacity-50 ${
                      errors.categoryId
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-input focus:ring-primary/50"
                    }`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                {errors.categoryId.message as string}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Name
            </label>
            <Input
              placeholder="Enter product name"
              {...register("productName")}
              disabled={showSuccess || isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 disabled:opacity-50 ${
                errors.productName
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            {errors.productName && (
              <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                {errors.productName.message as string}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Description
            </label>
            <Textarea
              placeholder="Enter product description"
              rows={5}
              {...register("description")}
              disabled={showSuccess || isLoading}
              style={{ maxHeight: "180px" }}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 disabled:opacity-50 ${
                errors.description
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            {errors.description && (
              <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                {errors.description.message as string}
              </p>
            )}
          </div>
          <Button
            type="submit"
            form="product-request-form"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={showSuccess || isLoading}
          >
            {isLoading ? "Submitting..." : "Send Request"}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        onOpenChange={(open) => {
          if (!open) {
            handleSuccessClose();
          }
        }}
      >
        <DialogContent className="max-w-sm w-full p-0">
          <DialogHeader className="pt-8 px-8">
            <DialogTitle className="text-lg font-bold text-center text-foreground">
              Thank you for submitting your product request
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              We will review it shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="px-8 pb-8">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white text-base font-medium py-3 mt-2"
              onClick={handleSuccessClose}
            >
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
