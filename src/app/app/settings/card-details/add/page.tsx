"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
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
import SettingsBackButton from "../../_components/SettingsBackButton";
import Link from "next/link";
import countries from "@/src/data/countries.json";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

const elementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "text-foreground",
      "::placeholder": {
        color: "text-foreground",
      },
      fontFamily: '"Poppins", sans-serif',
      fontSmoothing: "antialiased",
    },
    invalid: {
      color: "var(--destructive)",
    },
  },
  hidePostalCode: true,
};

function StripeForm({ onSaved }: { onSaved: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const addCardMutation = useAddCard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("US");
  const [zipCode, setZipCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  
  // Validation states
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [cardExpiryValid, setCardExpiryValid] = useState(false);
  const [cardCvcValid, setCardCvcValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);

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
                  className="text-muted-foreground"
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

export default function AddCardPage() {
  const router = useRouter();

  return (
    <div>
      <SettingsBackButton link="/app/settings/card-details" />

      <Link
        href={"/app/settings/card-details"}
        className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <h2 className="text-2xl font-semibold text-foreground mb-6">Add Card</h2>

      <Elements stripe={stripePromise}>
        <StripeForm onSaved={() => router.push("/app/settings/card-details")} />
      </Elements>
    </div>
  );
}
