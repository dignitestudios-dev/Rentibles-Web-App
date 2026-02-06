"use client";

import { LogOutIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/store/feature/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center md:w-125 rounded-[19px] bg-white">
      <button
        onClick={handleLogout}
        className="absolute cursor-pointer top-4 right-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
      >
        <LogOutIcon size={18} />
        Logout
      </button>
    </div>
  );
};

export default Logout;
