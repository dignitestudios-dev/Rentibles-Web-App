import React from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaymentCardsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardsData: any; // Replace with proper CardsData type if available
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;
}

const PaymentCards: React.FC<PaymentCardsProps> = ({
  cardsData,
  selectedCardId,
  setSelectedCardId,
}) => {
  const router = useRouter();

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <CreditCard className="w-5 h-5 text-blue-400" />
          <p className="text-foreground">Payment Method</p>
        </div>

        <Button
          variant="ghost"
          type="button"
          title="Select Card"
          onClick={() => router.push("/app/settings/card-details")}
          className="text-black"
        >
          Add Card
        </Button>
      </div>
      <div>
        {cardsData && cardsData.data.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cardsData.data.map((card: any) => (
            <div
              key={card._id}
              onClick={() => setSelectedCardId(card._id)}
              className={`flex items-center justify-between border-2 rounded-lg p-4 my-2 cursor-pointer transition-all ${
                selectedCardId === card._id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedCardId(card._id);
                }
              }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
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
    </div>
  );
};

export default PaymentCards;
