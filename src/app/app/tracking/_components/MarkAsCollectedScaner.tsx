"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { ImageIcon, VideoIcon, X, Upload, CheckCircle2 } from "lucide-react";

type FilePreview = {
  file: File;
  url: string;
  type: "image" | "video";
};

type MarkItemCollectedProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanned: (decodedText: string) => void;
  onEvidenceSubmit?: (files: File[]) => void;
  isSubmitting?: boolean;
};

type Step = "scan" | "evidence";

const MarkItemCollected = ({
  open,
  onOpenChange,
  onScanned,
  onEvidenceSubmit,
  isSubmitting = false,
}: MarkItemCollectedProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [step, setStep] = useState<Step>("scan");
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const safeStop = async () => {
    try {
      if (
        scannerRef.current &&
        scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
      ) {
        await scannerRef.current.stop();
      }
    } catch {
      // ignore
    } finally {
      scannerRef.current = null;
    }
  };

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep("scan");
      setPreviews([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open || step !== "scan") return;

    const timeout = setTimeout(() => {
      const element = document.getElementById("qr-reader");
      if (!element) return;

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            await safeStop();
            onScanned(decodedText);
            setStep("evidence"); // move to evidence step
          },
          () => {},
        )
        .catch((err) => console.error("Scanner start error:", err));
    }, 300);

    return () => {
      clearTimeout(timeout);
      safeStop();
    };
  }, [open, step]);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const files = Array.from(e.target.files ?? []);
    const newPreviews: FilePreview[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = ""; // reset input
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = () => {
    const files = previews.map((p) => p.file);
    onEvidenceSubmit?.(files);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={async (val) => {
        if (!val) await safeStop();
        onOpenChange(val);
      }}
    >
      <DialogContent className="">
        {/* ── STEP 1: QR Scanner ── */}
        {step === "scan" && (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-center text-lg font-semibold">
                Scan QR Code
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                Point camera at the QR code to continue
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                id="qr-reader"
                className="w-full rounded-lg overflow-hidden"
              />
              <p className="text-sm text-muted-foreground">
                Point camera at QR code to scan
              </p>
            </div>
          </>
        )}

        {/* ── STEP 2: Upload Evidence ── */}
        {step === "evidence" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <DialogTitle className="text-lg font-semibold">
                  Upload Pickup Evidence
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm">
                Add photos or videos as proof of pickup
              </DialogDescription>
            </DialogHeader>

            {/* Upload Buttons */}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex-1 flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl py-5 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm font-medium">Photo</span>
                <span className="text-xs text-muted-foreground">JPG, PNG</span>
              </button>

              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex-1 flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl py-5 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <VideoIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm font-medium">Video</span>
                <span className="text-xs text-muted-foreground">MP4, MOV</span>
              </button>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, "image")}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, "video")}
            />

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mt-1">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden aspect-square bg-muted"
                  >
                    {preview.type === "image" ? (
                      <img
                        src={preview.url}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={preview.url}
                        className="w-full h-full object-cover"
                        // muted
                        controls
                      />
                    )}

                    {/* Type badge */}
                    <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1">
                      {preview.type === "image" ? (
                        <ImageIcon className="w-3 h-3 text-white" />
                      ) : (
                        <VideoIcon className="w-3 h-3 text-white" />
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removePreview(index)}
                      className="absolute cursor-pointer top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter className="flex gap-4 mt-2">
              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={previews.length === 0 || isSubmitting}
                  className="w-full text-white"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Evidence ({previews.length})
                    </>
                  )}
                </Button>
              </div>
              <div>

              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full"
                disabled={isSubmitting}
                >
                Cancel
              </Button>
                  </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MarkItemCollected;
