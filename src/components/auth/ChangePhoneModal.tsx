import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { setUser } from "@/src/lib/store/feature/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/src/components/common/PhoneInput";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { axiosInstance } from "@/src/lib/axiosInstance";

const PhoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be valid"),
});

type PhoneFormData = z.infer<typeof PhoneSchema>;

interface ChangePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResendOtp: (phone: string) => void;
}

const ChangePhoneModal: React.FC<ChangePhoneModalProps> = ({
  isOpen,
  onClose,
  onResendOtp,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phone: "" },
  });

  const phoneValue = watch("phone");

  const updatePhoneMutation = useMutation({
    mutationFn: async (data: PhoneFormData) => {
      const response = await axiosInstance.put("/user", { phone: data.phone });
      return response.data;
    },
    onSuccess: (response) => {
      SuccessToast(response.message || "Phone number updated successfully");
      onResendOtp(phoneValue);
      if (user) {
        const updatedUser = {
          ...user,
          phone: phoneValue,
        };
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      reset();
      onClose();
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      ErrorToast(message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-foreground">
            Change Phone Number
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => updatePhoneMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="pt-2">
            <PhoneInput
              placeholder="Phone Number"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <Button
            type="submit"
            disabled={updatePhoneMutation.isPending}
            className="w-full bg-primary hover:bg-primary/80 font-semibold py-6 rounded-lg transition-all active:scale-95"
          >
            {updatePhoneMutation.isPending ? "Updating..." : "Update Phone"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePhoneModal;
