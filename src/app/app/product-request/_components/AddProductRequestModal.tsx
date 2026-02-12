// components/AddProductRequestModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PackagePlus } from "lucide-react";
import {
  AddProductRequestFormData,
  Category,
  DaysOfWeek,
} from "@/src/types/index.type";
import DaySelector from "./DaySelector";

interface AddProductRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: AddProductRequestFormData) => void;
}

const AddProductRequestModal: React.FC<AddProductRequestModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AddProductRequestFormData>({
    categoryId: "",
    productName: "",
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddProductRequestFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof AddProductRequestFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddProductRequestFormData, string>> =
      {};

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      categoryId: "",
      productName: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  const [selectedDays, setSelectedDays] = useState<DaysOfWeek>();

  const handleDaysChange = (days: DaysOfWeek) => {
    setSelectedDays(days);
    console.log(
      "Selected days:",
      days.filter((d) => d.enabled).map((d) => d.day),
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <PackagePlus className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Add Product Request
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-600">
            Fill in the details below to request a new product
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Category Select */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700"
            >
              Select Category <span className="text-primary/90">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange("categoryId", value)}
            >
              <SelectTrigger
                className={`w-full ${errors.categoryId ? "border-primary/90" : ""}`}
                id="category"
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-primary/90 mt-1">
                {errors.categoryId}
              </p>
            )}
          </div>

          <div>
            <DaySelector
              selectedDays={selectedDays}
              onChange={handleDaysChange}
              label="Working Days"
              showSelectedCount={true}
            />
          </div>

          {/* Product Name Input */}
          <div className="space-y-2">
            <Label
              htmlFor="productName"
              className="text-sm font-semibold text-gray-700"
            >
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              className={errors.productName ? "border-primary/90" : ""}
            />
            {errors.productName && (
              <p className="text-xs text-primary/90 mt-1">
                {errors.productName}
              </p>
            )}
          </div>

          {/* Product Description Textarea */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Product Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the product you're looking for..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[120px] resize-none ${errors.description ? "border-primary/90" : ""}`}
            />
            {errors.description && (
              <p className="text-xs text-primary/90 mt-1">
                {errors.description}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold py-6 rounded-lg transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-6 rounded-lg transition-all active:scale-95"
            >
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductRequestModal;
