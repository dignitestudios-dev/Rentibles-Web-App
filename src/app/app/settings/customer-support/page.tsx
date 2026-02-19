"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import Loader from "@/src/components/common/Loader";
import SettingsBackButton from "../_components/SettingsBackButton";
import { useSupportTicket } from "@/src/lib/api/support";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


const supportSchema = z.object({
  title: z.string().min(1, "Title is required!"),
  description: z.string().min(1, "Description is required!"),
});
type SupportFormData = z.infer<typeof supportSchema>;

export default function CustomerSupport() {
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
  });


  // Use custom hook for support ticket mutation
  const supportTicketMutation = useSupportTicket();
  const isLoading = supportTicketMutation.isPending;

  return (
    <div>
      <Loader show={isLoading} />
      <SettingsBackButton />
      <h2 className="text-2xl font-semibold text-foreground mb-2">Customer Support</h2>
      <form onSubmit={handleSubmit((data) => {
        supportTicketMutation.mutate(data, {
          onSuccess: () => {
            setShowSuccess(true);
            reset();
          },
        });
      })} className="max-w-md space-y-5">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Title</label>
          <div>
            <input
              type="text"
              placeholder="Enter a title"
              {...register("title")}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 ${
                errors.title
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
          </div>
          {errors.title && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <div>
            <textarea
              placeholder="Describe your issue"
              rows={5}
              {...register("description")}
              disabled={isLoading}
              style={{ maxHeight: "180px" }}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 ${
                errors.description
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
          </div>
          {errors.description && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>

      {/* Success Dialog (shadcn/ui) */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm w-full p-0">
          <DialogHeader className="pt-8 px-8">
            <DialogTitle className="text-xl font-bold text-center mb-2 text-foreground">Thank You For<br />Submitting a Request</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mb-6">to Customer Support</DialogDescription>
          </DialogHeader>
          <div className="px-8 pb-8">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white text-base font-medium rounded-xl py-3"
              onClick={() => setShowSuccess(false)}
            >
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

