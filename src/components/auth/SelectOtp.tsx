"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  Loader,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AcountVerified from "./AcountVerified";
import Image from "next/image";
import { Checkmark_orange, Otp_Icon } from "@/public/images/export";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useInvalidateAllQueries } from "@/src/hooks/useInvalidateAllQueries";
import { logout } from "@/src/lib/store/feature/authSlice";

const SelectOtp = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showVerified, setShowVerified] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { invalidateAll } = useInvalidateAllQueries();
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      invalidateAll();
      dispatch(logout());
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full ">
      {showVerified ? (
        <AcountVerified />
      ) : (
        <>
          <div className=" top-4 left-4">
            <button
              onClick={() => router.push("/auth/register")}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5 " />
            </button>
          </div>
          <div className="top-4 right-6 absolute">
            <button
              onClick={() => handleConfirmLogout()}
              className="p-2 hover:bg-muted-foreground rounded-md transition-colors bg-accent"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5 " />
              )}
            </button>
          </div>
          <div className="flex justify-center items-center">
            <Image src={Otp_Icon} alt="otp" className="w-40 " />
          </div>

          <h2 className="text-[24px] capitalize text-center font-bold my-4">
            Verify your email <br /> and phone number
          </h2>
          <Link
            href={
              user?.isEmailVerified ? "/auth/select-otp" : "/auth/email-verify"
            }
            className={`mb-4 flex items-center cursor-pointer justify-between p-4 rounded-2xl shadow-sm ${user?.isEmailVerified ? "border-2 border-orange-400" : ""}`}
          >
            <div className="flex items-center gap-3 justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Email address
                  </p>
                  <p className="text-xs text-foreground">{user?.email}</p>
                </div>
              </div>
              {user?.isEmailVerified ? (
                <Image
                  src={Checkmark_orange}
                  width={28}
                  alt="Checkmark_orange"
                />
              ) : (
                <button className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-500 text-white">
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </Link>
          <Link
            href={
              user?.isPhoneVerified ? "/auth/select-otp" : "/auth/phone-verify"
            }
            className={`mb-4 flex items-center cursor-pointer   justify-between p-4 rounded-2xl shadow-sm ${user?.isPhoneVerified ? "border-2 border-orange-400" : ""}`}
          >
            <div className="flex items-center gap-3 justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Phone number
                  </p>
                  <p className="text-xs text-foreground">+1 {user?.phone}</p>
                </div>
              </div>
              {user?.isPhoneVerified ? (
                <Image
                  src={Checkmark_orange}
                  width={28}
                  alt="Checkmark_orange"
                />
              ) : (
                <button className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-500 text-white">
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </Link>
          {user?.isEmailVerified && user?.isPhoneVerified && (
            <Button
              onClick={() => setShowVerified(true)}
              className="w-full cursor-pointer max-w-md  mt-3 h-14 bg-[#F85E00] text-white text-lg"
            >
              Next
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default SelectOtp;
