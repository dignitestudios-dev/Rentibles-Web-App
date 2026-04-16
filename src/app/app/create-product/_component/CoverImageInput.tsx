import * as React from "react";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import { ErrorToast } from "@/src/components/common/Toaster";
import Image from "next/image";

type CoverImageInputProps = {
  value?: File | null;
  prefilledImage?: string; // URL from backend
  onChange: (file: File | null) => void;
  error?: string;
  maxSizeMB?: number;
};

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const CoverImageInput: React.FC<CoverImageInputProps> = ({
  value,
  prefilledImage,
  onChange,
  error,
  maxSizeMB = 20,
}) => {
  const [preview, setPreview] = React.useState<{
    type: "file" | "url";
    data: string;
  } | null>(null);
  const [showNewUploadOption, setShowNewUploadOption] = React.useState(false);

  // Sync preview when value changes (edit mode support)
  // Handles both prefilled images and new file uploads
  React.useEffect(() => {
    if (!value && !prefilledImage) {
      if (preview && preview.type === "file") {
        URL.revokeObjectURL(preview.data);
      }
      setPreview(null);
      return;
    }

    // If new file uploaded, use that
    if (value) {
      const url = URL.createObjectURL(value);
      setPreview({ type: "file", data: url });
      return;
    }

    // Otherwise use prefilled image
    if (prefilledImage) {
      setPreview({ type: "url", data: prefilledImage });
      return;
    }
  }, [value, prefilledImage]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      ErrorToast("Only PNG, JPG, JPEG, and WEBP files are allowed");
      event.target.value = "";
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      ErrorToast(`File size must be less than ${maxSizeMB}MB`);
      event.target.value = "";
      return;
    }

    onChange(file);
    event.target.value = "";
    setShowNewUploadOption(false);
  };

  const replaceImage = () => {
    // User can replace prefilled image with new upload
    onChange(null);
    setShowNewUploadOption(true);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup file preview only (not backend URLs)
      if (preview && preview.type === "file") {
        URL.revokeObjectURL(preview.data);
      }
    };
  }, []);

  return (
    <div className="space-y-3 w-full">
      <div
        className={`border border-dashed rounded-lg sm:rounded-2xl h-56 flex items-center justify-center transition min-h-[300px] sm:min-h-[440px] overflow-hidden
          ${
            error
              ? "border-red-500 text-red-500"
              : "border-muted-foreground text-muted-foreground hover:border-[#F85E00]"
          }
        `}
      >
        {preview && !showNewUploadOption ? (
          <div className="relative w-full h-full group">
            <div className="flex w-full justify-center items-center">
              <Image
                src={preview.data}
                alt="Cover preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Action buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={replaceImage}
                className="opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 sm:p-3 shadow-lg transition px-3 sm:px-4 text-xs sm:text-sm font-medium"
                title="Replace with new image"
              >
                Replace
              </button>
            </div>
          </div>
        ) : (
          <>
            <Input
              id="cover-image"
              type="file"
              accept={VALID_TYPES.join(",")}
              onChange={handleUpload}
              className="hidden"
            />
            <label
              htmlFor="cover-image"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <Camera size={24} className="sm:w-9 sm:h-9" />
              <p className="mt-2 sm:mt-3 font-medium text-xs sm:text-sm text-center px-2">
                {showNewUploadOption
                  ? "Upload New Cover Image"
                  : "Upload Cover Image (max 20MB)"}
              </p>
              <p className="text-xs mt-1 opacity-70 px-2 text-center">
                PNG, JPG, JPEG, WEBP
              </p>
            </label>
          </>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
};
