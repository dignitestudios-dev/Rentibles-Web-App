"use client";

import { WhiteLogo } from "@/public/images/export";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth/get-started");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-screen min-h-screen flex justify-center items-center auth_bg p-3 md:py-8">
      <Image src={WhiteLogo} alt="orange_logo" className="w-70.5" />
    </div>
  );
}
