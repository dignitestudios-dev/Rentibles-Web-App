import * as React from "react";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import { ErrorToast } from "@/src/components/common/Toaster";

type ProductImagesInputProps = {
  value?: File[];
  onChange: (images: File[]) => void;
  error?: string;
  maxImages?: number;
};

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const ProductImagesInput: React.FC<ProductImagesInputProps> = ({
  value = [],
  onChange,
  error,
  maxImages = 10,
}) => {
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  // Sync previews when value changes (important for edit forms)
  React.useEffect(() => {
    const previews = value.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (value.length + files.length > maxImages) {
      ErrorToast(`Maximum ${maxImages} images allowed`);
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
    const updatedImages = value.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);
    onChange(updatedImages);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup product images previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

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
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-white bg-opacity-90 px-1.5 py-0.5 rounded text-xs font-semibold text-gray-700">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload */}
        {value.length < maxImages && (
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
              <p className="text-xs mt-1 opacity-70">PNG, JPG supported</p>
            </label>
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
