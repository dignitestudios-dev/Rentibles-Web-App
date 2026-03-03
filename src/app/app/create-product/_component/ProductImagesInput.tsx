import * as React from "react";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import { ErrorToast } from "@/src/components/common/Toaster";

type ProductImagesInputProps = {
  value?: File[];
  prefilledImages?: string[]; // URLs from backend
  onChange: (images: File[]) => void;
  onRemainingImages?: (remainingUrls: string[]) => void; // Track remaining prefilled images
  error?: string;
  maxImages?: number;
};

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

interface ImagePreview {
  type: "file" | "url";
  data: string;
  sourceUrl?: string; // Original URL for prefilled images
}

export const ProductImagesInput: React.FC<ProductImagesInputProps> = ({
  value = [],
  prefilledImages = [],
  onChange,
  onRemainingImages,
  error,
  maxImages = 10,
}) => {
  const [imagePreviews, setImagePreviews] = React.useState<ImagePreview[]>([]);
  const [removedPrefilled, setRemovedPrefilled] = React.useState<string[]>([]); // Track removed prefilled image URLs

  React.useEffect(() => {
    const previews: ImagePreview[] = [];

    // Add new file uploads
    value.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      previews.push({ type: "file", data: fileUrl });
    });

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        if (preview.type === "file") {
          URL.revokeObjectURL(preview.data);
        }
      });
    };
  }, [value]);

  // Effect 2: Handle prefilled images (for UPDATE product - with prefilled images)
  React.useEffect(() => {
    // Only run if there are prefilled images
    if (prefilledImages.length === 0) return;

    const previews: ImagePreview[] = [];

    // Add prefilled images (from backend) - except removed ones
    prefilledImages.forEach((url) => {
      if (!removedPrefilled.includes(url)) {
        previews.push({ type: "url", data: url, sourceUrl: url });
      }
    });

    // Add new file uploads
    value.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      previews.push({ type: "file", data: fileUrl });
    });

    setImagePreviews(previews);

    // Notify parent about remaining prefilled images
    const remainingPrefilled = prefilledImages.filter(
      (url) => !removedPrefilled.includes(url),
    );
    if (onRemainingImages) {
      onRemainingImages(remainingPrefilled);
    }

    return () => {
      previews.forEach((preview) => {
        if (preview.type === "file") {
          URL.revokeObjectURL(preview.data);
        }
      });
    };
  }, [value, prefilledImages, removedPrefilled, onRemainingImages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Calculate total: remaining prefilled + new uploads + new files
    const remainingPrefilledCount =
      prefilledImages.length - removedPrefilled.length;
    const totalImages = remainingPrefilledCount + value.length + files.length;

    if (totalImages > maxImages) {
      ErrorToast(
        `Maximum ${maxImages} images allowed. Current: ${remainingPrefilledCount + value.length}`,
      );
      event.target.value = "";
      return;
    }

    const invalidFiles = files.filter(
      (file) => !VALID_TYPES.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      ErrorToast("Only PNG, JPG, JPEG, and WEBP files are allowed");
      event.target.value = "";
      return;
    }

    onChange([...value, ...files]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    const remainingPrefilled = prefilledImages.filter(
      (url) => !removedPrefilled.includes(url),
    );
    const prefilledCount = remainingPrefilled.length;

    // If removing a prefilled image
    if (index < prefilledCount) {
      const urlToRemove = remainingPrefilled[index];
      setRemovedPrefilled([...removedPrefilled, urlToRemove]);
      return;
    }

    // If removing a newly uploaded image
    const newImageIndex = index - prefilledCount;
    const updatedImages = value.filter((_, i) => i !== newImageIndex);
    onChange(updatedImages);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup product images previews
      imagePreviews.forEach((preview) => {
        if (preview.type === "file") {
          URL.revokeObjectURL(preview.data);
        }
      });
    };
  }, [imagePreviews]);

  const totalImages =
    prefilledImages.length - removedPrefilled.length + value.length;

  return (
    <div className="space-y-4">
      <div
        className={`border border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition
          ${
            error
              ? "border-red-500 text-red-500"
              : "border-muted-foreground text-muted-foreground hover:border-[#F85E00]"
          }
        `}
      >
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-min">
              {imagePreviews.map((preview, index) => {
                const isPreFilled = preview.type === "url";

                return (
                  <div
                    key={preview.sourceUrl || index}
                    className="relative group flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                  >
                    <img
                      src={preview.data}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Remove button - available for both prefilled and new uploads */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {/* Image number badge */}
                    <div className="absolute bottom-1 left-1 bg-white bg-opacity-90 px-1.5 py-0.5 rounded text-xs font-semibold text-gray-700">
                      {index + 1}
                    </div>

                    {/* Prefilled indicator badge */}
                    {/* {isPreFilled && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold shadow-md">
                        ✓
                      </div>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload section - show only if limit not reached */}
        {totalImages < maxImages && (
          <div className="relative w-full mt-4">
            <Input
              id="product-images"
              type="file"
              accept={VALID_TYPES.join(",")}
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="product-images"
              className="flex flex-col items-center justify-center w-full h-32 cursor-pointer transition group"
            >
              <Camera size={36} />
              <p className="mt-3 font-medium">Upload Product Images</p>
              <p className="text-xs mt-1 opacity-70">
                PNG, JPG supported • {totalImages}/{maxImages}
              </p>
            </label>
          </div>
        )}

        {/* Show message when max reached */}
        {totalImages >= maxImages && (
          <div className="w-full text-center py-4">
            <p className="text-sm font-semibold text-gray-600">
              Maximum {maxImages} images reached
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">
          {error || "Please upload at least 4 images"}
        </p>
      )}
    </div>
  );
};
