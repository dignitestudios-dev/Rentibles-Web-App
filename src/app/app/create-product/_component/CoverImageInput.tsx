import * as React from "react";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import { ErrorToast } from "@/src/components/common/Toaster";

type CoverImageInputProps = {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  maxSizeMB?: number;
};

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const CoverImageInput: React.FC<CoverImageInputProps> = ({
  value,
  onChange,
  error,
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);

  // Sync preview when value changes (edit mode support)
  React.useEffect(() => {
    if (!value) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

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
  };

  const removeImage = () => {
    onChange(null);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup cover image preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Helper text */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Camera size={14} />
        <span>Upload a high-quality cover image</span>
      </div>

      <div
        className={`border border-dashed rounded-2xl h-56 flex items-center justify-center transition overflow-hidden
          ${
            error
              ? "border-red-500 text-red-500"
              : "border-muted-foreground text-muted-foreground hover:border-[#F85E00]"
          }
        `}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />

            {/* Remove button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Badge */}
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Cover Image
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
              <Camera size={36} />
              <p className="mt-3 font-medium">Upload Cover Image</p>
              <p className="text-xs mt-1 opacity-70">PNG, JPG, JPEG or WEBP</p>
            </label>
          </>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
