"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import SettingsBackButton from "../_components/SettingsBackButton";

const supportSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must not exceed 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

type SupportFormData = z.infer<typeof supportSchema>;

export default function CustomerSupportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
  });
  const [tickets, setTickets] = useState([
    {
      id: "#TK001",
      subject: "Unable to verify identity",
      status: "Open",
      date: "Feb 15, 2026",
      description:
        "I'm unable to complete the identity verification process.",
    },
    {
      id: "#TK002",
      subject: "Payment issue",
      status: "Resolved",
      date: "Feb 10, 2026",
      description: "Payment was declined even with valid card.",
    },
  ]);

  const onSubmit = async (data: SupportFormData) => {
    setIsLoading(true);
    // TODO: Add support ticket creation logic
    setTimeout(() => {
      setIsLoading(false);
      reset();
    }, 1000);
  };

  return (
    <div>
      <SettingsBackButton />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Customer Support
      </h2>
      <p className="text-muted-foreground mb-6">
        Get help and create support tickets
      </p>

      {/* Submit a Ticket */}
      <div className="border border-border rounded-lg p-6 mb-8 bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Submit a Ticket
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subject
            </label>
            <input
              type="text"
              placeholder="Brief subject of your issue"
              {...register("subject")}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
                errors.subject
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            {errors.subject && (
              <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <Textarea
              placeholder="Describe your issue in detail..."
              {...register("message")}
              className={`min-h-32 resize-none border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
                errors.message
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            {errors.message && (
              <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>

      {/* Support Tickets */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Your Support Tickets
        </h3>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-primary">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        ticket.status === "Open"
                          ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                          : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="font-medium text-foreground">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {ticket.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
