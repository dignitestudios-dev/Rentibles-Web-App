"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoreHorizontal, Trash2, CreditCard } from "lucide-react";
import SettingsBackButton from "../_components/SettingsBackButton";
import Loader from "@/src/components/common/Loader";
import { useGetCards, useDeleteCard } from "@/src/lib/api/cards";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import ConfirmDialog from "@/src/components/common/ConfirmDialog";

export default function CardDetailsPage() {
  const queryClient = useQueryClient();
  const { data: cardsData, isLoading, isError } = useGetCards();
  const deleteCardMutation = useDeleteCard();

  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Refetch cards when page focuses (coming back from add card)
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [queryClient]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCardMutation.mutateAsync(id);
      SuccessToast("Card removed");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    } catch (error) {
      ErrorToast(getAxiosErrorMessage(error, "Failed to delete card"));
    } finally {
      // dropdown will auto-close
    }
  };

  if (isError) {
    return (
      <div>
        <SettingsBackButton />
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          <p>Failed to load cards.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Loader show={isLoading || deleteCardMutation.isPending} />
      <SettingsBackButton />

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete Card"
        description="Are you sure you want to delete this card?"
        confirmLabel="Yes"
        cancelLabel="No"
        loading={deleteCardMutation.isPending}
        onConfirm={async () => {
          if (!selectedToDelete) return;
          await handleDelete(selectedToDelete);
          setIsConfirmOpen(false);
          setSelectedToDelete(null);
        }}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Payment Information</h2>
          <p className="text-muted-foreground text-sm">Attached Cards</p>
        </div>
        <Link href="/app/settings/card-details/add">
          <Button className="bg-primary hover:bg-primary/90">+ Add</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {cardsData?.data?.length ? (
          cardsData.data.map((card) => (
            <div key={card._id} className="flex items-center justify-between border border-border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{card.brand?.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">**** **** **** {card.last4}</p>
                </div>
              </div>

              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-md hover:bg-muted/50" aria-label="card-menu">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onSelect={() => {
                        setSelectedToDelete(card._id);
                        setIsConfirmOpen(true);
                      }}
                      className="flex items-center gap-3"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">No cards attached yet.</div>
        )}
      </div>
    </div>
  );
}
