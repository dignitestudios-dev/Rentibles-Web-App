"use client";

import React, { useState } from "react";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "@/src/components/forms/StripeForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentCardsProps {
  cardsData: any;
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;
}

const PaymentCards: React.FC<PaymentCardsProps> = ({
  cardsData,
  selectedCardId,
  setSelectedCardId,
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [open, setOpen] = useState(false); // ✅ control modal

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CreditCard className="w-4 h-4 mr-2" />
          Select Payment Method
        </Button>
      </DialogTrigger>

<DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showAddCard && (
              <ArrowLeft
                className="w-4 h-4 cursor-pointer"
                onClick={() => setShowAddCard(false)}
              />
            )}
            <CreditCard className="w-5 h-5 text-blue-400" />
            {showAddCard ? "Add Card" : "Payment Method"}
          </DialogTitle>
        </DialogHeader>

        {/* 🔁 SWITCH VIEW */}
        {showAddCard ? (
          <Elements stripe={stripePromise}>
            <StripeForm
              onSaved={() => {
                setShowAddCard(false);
              }}
            />
          </Elements>
        ) : (
          <>
            {/* Add Card Button */}
            <div className="flex justify-end mb-2">
              <Button variant="ghost" onClick={() => setShowAddCard(true)}>
                Add Card
              </Button>
            </div>

            {/* Cards List */}
<div className="flex-1 overflow-y-auto pr-1">
                {cardsData && cardsData.data.length > 0 ? (
                cardsData.data.map((card: any) => (
                  <div
                    key={card._id}
                    onClick={() => setSelectedCardId(card._id)}
                    className={`flex items-center justify-between border-2 rounded-lg p-4 my-2 cursor-pointer transition-all ${
                      selectedCardId === card._id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {card.brand?.toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          **** **** **** {card.last4}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Exp: {card.expMonth}/{card.expYear}
                        </p>
                      </div>
                    </div>

                    {selectedCardId === card._id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No cards available
                </p>
              )}
            </div>

            {/* ✅ DONE BUTTON */}
            <div className="mt-4">
              <Button
                className="w-full"
                onClick={() => setOpen(false)}
                disabled={!selectedCardId} // optional: force selection
              >
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentCards;