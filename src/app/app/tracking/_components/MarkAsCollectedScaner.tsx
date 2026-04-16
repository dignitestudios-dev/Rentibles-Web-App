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
import WriteReviewModal from "./Writereviewmodal";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  onBackToHome?: () => void;
  onSubmitSuccess?: () => void; // ← NEW: called after successful submission
  isSubmitting?: boolean;
  type: "pickup" | "dropOff";
  // Required for review modal on dropOff
  bookingId?: any;
  product?: any;
};

type Step = "scan" | "evidence";

// ─── Pickup Success Modal ─────────────────────────────────────────────────────

const PickupSuccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-w-sm rounded-3xl p-8 text-center">
      <div className="flex justify-center mb-5">
        <img src="/images/pickup-icon.png" alt="pickup success" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-3">
        Order Picked Up Successfully
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Thank you for picking up your order! Please note, if the product isn't
        returned within 4 hours{" "}
        <strong className="text-foreground font-semibold">
          (including a 15-minute grace period),
        </strong>{" "}
        your rental will automatically extend for the next 24 hours.
      </p>
      <Button
        onClick={onClose}
        className="w-full rounded-2xl py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md"
      >
        Okay
      </Button>
    </DialogContent>
  </Dialog>
);

// ─── Rental Return Confirmed Modal ───────────────────────────────────────────

const RentalReturnModal = ({
  open,
  onFeedback,
  onBackToHome,
}: {
  open: boolean;
  onFeedback: () => void;
  onBackToHome: () => void;
}) => (
  <Dialog open={open}>
    <DialogContent className="max-w-sm rounded-3xl p-8 text-center">
      <div className="flex justify-center mb-5">
        <img src="/images/pickup-icon.png" alt="return confirmed" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-3">
        Rental Return Confirmed
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Thank you for returning your rental on time! We appreciate your
        promptness. Your feedback helps us improve—let us know how we did!
      </p>
      <Button
        onClick={onFeedback}
        className="w-full rounded-2xl py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md mb-3"
      >
        Give Feedback
      </Button>
      <button
        onClick={onBackToHome}
        className="text-sm font-medium text-primary hover:underline"
      >
        Back to home
      </button>
    </DialogContent>
  </Dialog>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const MarkItemCollected = ({
  open,
  onOpenChange,
  onScanned,
  onEvidenceSubmit,
  onSubmitSuccess, // ← NEW prop, no internal success modal here
  isSubmitting = false,
  type,
  bookingId,
  product,
}: MarkItemCollectedProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [step, setStep] = useState<Step>("scan");
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const prevIsSubmitting = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ── Auto-advance: when isSubmitting flips false → notify parent ──────────
  useEffect(() => {
    if (prevIsSubmitting.current && !isSubmitting && step === "evidence") {
      onOpenChange(false);
      onSubmitSuccess?.(); // ← delegate success handling to parent
    }
    prevIsSubmitting.current = isSubmitting;
  }, [isSubmitting]);

  // ── Scanner helpers ──────────────────────────────────────────────────────

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

  // ── Reset on close ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) {
      setStep("scan");
      setPreviews([]);
    }
  }, [open]);

  // ── Start QR scanner ─────────────────────────────────────────────────────

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
            setStep("evidence");
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

  // ── File handling ────────────────────────────────────────────────────────

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "image" | "video",
  ) => {
    const files = Array.from(e.target.files ?? []);
    const newPreviews: FilePreview[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: fileType,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
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

  const handleClose = async (val: boolean) => {
    if (!val) await safeStop();
    onOpenChange(val);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        {/* STEP 1 — QR Scanner */}
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

        {/* STEP 2 — Upload Evidence */}
        {step === "evidence" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <DialogTitle className="text-lg font-semibold">
                  Upload {type === "pickup" ? "Pickup" : "Drop-off"} Evidence
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm">
                Add photos or videos as proof of{" "}
                {type === "pickup" ? "pickup" : "drop-off"}
              </DialogDescription>
            </DialogHeader>

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
                        controls
                      />
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1">
                      {preview.type === "image" ? (
                        <ImageIcon className="w-3 h-3 text-white" />
                      ) : (
                        <VideoIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
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
                  className="w-full text-white flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit
                      <Upload />
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

export { PickupSuccessModal, RentalReturnModal };
export default MarkItemCollected;
