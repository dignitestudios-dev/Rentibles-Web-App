"use client";

import { LogOutIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/store/feature/authSlice";
import { useInvalidateAllQueries } from "@/src/hooks/useInvalidateAllQueries";
import ConfirmDialog from "./ConfirmDialog";

const Logout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { invalidateAll } = useInvalidateAllQueries();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      invalidateAll();
      dispatch(logout());
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
      setOpenConfirm(false);
    }
  };

  return (
    <>
      <div className="relative w-full flex flex-col items-center justify-center md:w-125 rounded-[19px] bg-white">
        <button
          onClick={() => setOpenConfirm(true)}
          className="absolute cursor-pointer top-4 right-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
        >
          <LogOutIcon size={18} />
          Logout
        </button>
      </div>
      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Log out"
        description="Are you sure you want to log out?"
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={handleConfirmLogout}
        loading={isLoading}
      />
    </>
  );
};

export default Logout;
