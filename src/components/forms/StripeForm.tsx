"use client";

import { useState, useMemo } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/src/components/common/Loader";
import { useAddCard } from "@/src/lib/api/cards";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import countries from "@/src/data/countries.json";
import { useThemeContext } from "@/src/lib/theme/ThemeProvider";

interface StripeFormProps {
  onSaved: () => void;
}

export default function StripeForm({ onSaved }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const addCardMutation = useAddCard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("US");
  const [zipCode, setZipCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { isDark } = useThemeContext();

  // Validation states
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [cardExpiryValid, setCardExpiryValid] = useState(false);
  const [cardCvcValid, setCardCvcValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);

  // Stripe Elements iframe ke andar CSS variables resolve nahi hote,
  // isliye dark/light ke liye direct colors set kar rahe hain.
  const elementOptions = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "16px",
          color: isDark ? "#F9FAFB" : "#111827", // near white / near black
          backgroundColor: isDark ? "#343436" : "#F3F3F3",
          "::placeholder": {
            color: isDark ? "#6B7280" : "#6B7280",
          },
          fontFamily: '"Poppins", sans-serif',
          fontSmoothing: "antialiased",
        },
        invalid: {
          color: "#F43F5E",
        },
      },
      hidePostalCode: true,
    }),
    [isDark],
  );

  const isFormValid =
    cardNumberValid &&
    cardExpiryValid &&
    cardCvcValid &&
    zipCodeValid &&
    country;

  const handleSubmit = async () => {
    if (!stripe || !elements || !isFormValid) return;

    setFormError(null);
    setIsSubmitting(true);
    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error("Card element not found");
      }

      // Create PaymentMethod directly from card element
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          address: {
            country: country,
            postal_code: zipCode,
          },
        },
      });

      // Handle Stripe validation errors
      if (error) {
        setFormError(error.message || "Invalid card details");
        setIsSubmitting(false);
        return;
      }

      if (!paymentMethod?.id) {
        throw new Error("No payment method created");
      }

      // Call API with just the paymentMethodId
      await addCardMutation.mutateAsync({ paymentMethodId: paymentMethod.id });
      SuccessToast("Card added successfully");
      // Delay redirect to ensure cache is invalidated
      setTimeout(() => {
        onSaved();
      }, 300);
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err, "Failed to add card");
      setFormError(errorMessage);
      ErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Loader show={isSubmitting || addCardMutation.isPending} />
      <div className="max-w-md">
        {/* Error Message */}
        {formError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive font-medium">{formError}</p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 mb-6">
          {/* Card Number */}
          <div className="border-b border-border/50 pb-4">
            <label className="block text-sm font-medium text-foreground mb-3">
              Card number
            </label>
            <div className="text-foreground! placeholder:text-muted-foreground">
              <CardNumberElement
                key={isDark ? "dark" : "light"}
                options={elementOptions}
                onChange={(e) => {
                  setCardNumberValid(e.complete && !e.error);
                }}
              />
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4 border-b border-border/50 pb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                MM / YY
              </label>
              <div className="text-foreground placeholder:text-muted-foreground">
                <CardExpiryElement
                  key={isDark ? "dark-exp" : "light-exp"}
                  options={elementOptions}
                  onChange={(e) => {
                    setCardExpiryValid(e.complete && !e.error);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                CVC
              </label>
              <div className="text-foreground placeholder:text-muted-foreground">
                <CardCvcElement
                  key={isDark ? "dark-cvc" : "light-cvc"}
                  options={elementOptions}
                  onChange={(e) => {
                    setCardCvcValid(e.complete && !e.error);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Country */}
          <div className="border-b border-border/50 pb-4">
            <label className="block text-sm font-medium text-foreground mb-3">
              Country
            </label>
            <Select
              value={country}
              onValueChange={setCountry}
              disabled={isSubmitting || addCardMutation.isPending}
            >
              <SelectTrigger className="w-full bg-transparent border-0 h-10 text-foreground focus:ring-0 shadow-none px-0 pb-2 border-b border-border/50 focus:border-primary rounded-none disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue
                  placeholder="Select country"
                  className="text-foreground"
                />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border rounded-lg">
                {countries.map((c) => (
                  <SelectItem
                    key={c.code}
                    value={c.code}
                    className="cursor-pointer text-foreground"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setZipCodeValid(e.target.value.trim() !== "");
              }}
              placeholder="ZIP Code"
              disabled={isSubmitting || addCardMutation.isPending}
              className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-base border-0 pb-2 border-b border-border/50 focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save Button - Orange */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !stripe || !isFormValid}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-base"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
