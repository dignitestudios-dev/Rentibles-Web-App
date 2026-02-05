"use client";
import { Submitted_img } from "@/public/images/export";
import { RootState } from "@/src/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfileStatus = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (
      user?.identityStatus === "pending" ||
      user?.identityStatus === "approved"
    ) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (user?.identityStatus === "pending") {
    return (
      <div className="text-center flex flex-col justify-center items-center">
        <Image width={259} src={Submitted_img} alt="Submitted_img" />
        <h2 className="text-[24px] font-bold mt-4">Request Submitted</h2>
        <p className="text-[#2A2A2A] text-[16px] mt-2">
          Your profile is currently under review. We'll update you once it's
          approved.
        </p>
      </div>
    );
  }

  if (user?.identityStatus === "rejected") {
    return (
      <div className="text-center flex flex-col justify-center items-center">
        <Image width={259} src={Submitted_img} alt="Submitted_img" />
        <h2 className="text-[24px] font-bold mt-4">Profile Rejected</h2>
        <p className="text-[#2A2A2A] text-[16px] mt-2">
          Your profile has been rejected. Please review and submit again.
        </p>

        <Link
          href="/auth/identity-verification"
          className="w-full h-12.25 bg-[#F85E00] cursor-pointer text-white flex items-center justify-center gap-2 rounded-md mt-4"
        >
          Resubmit
        </Link>
      </div>
    );
  }

  if (user?.identityStatus === "approved") {
    return (
      <div className="text-center flex flex-col justify-center items-center">
        <Image width={259} src={Submitted_img} alt="Submitted_img" />
        <h2 className="text-[24px] font-bold mt-4">Profile Approved</h2>
        <p className="text-[#2A2A2A] text-[16px] mt-2">
          Your account has been successfully verified and approved.
        </p>
      </div>
    );
  }

  return null;
};

export default ProfileStatus;
