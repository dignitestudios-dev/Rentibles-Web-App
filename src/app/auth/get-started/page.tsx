"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon, OrangeLogo } from "@/public/images/export";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div>
      <div className="w-full h-auto flex flex-col items-center p-6 justify-center md:w-125 rounded-[19px] bg-white">
        <Image src={OrangeLogo} alt="orange_logo" className="w-27" />

        <div className="w-full max-w-md flex flex-col gap-4 mt-10">
          <Button
            className="
              h-14
              rounded-xl
              bg-white
              border-2
              border-orange-400
              text-orange-400
              text-base
              font-medium
              hover:bg-white
              hover:text-orange-400
              hover:border-orange-400
              cursor-pointer
            "
            onClick={() => router.push("/auth/login")}
          >
            Continue with Email
          </Button>

          <Button
            className="
              h-14
              rounded-xl
              bg-white
              border-2
              border-orange-400
              text-orange-400
              text-base
              font-medium
              hover:bg-white
              hover:text-orange-400
              hover:border-orange-400
              cursor-pointer
            "
          >
            Continue with Guest Mode
          </Button>

          <Button
            className="
              h-14
              rounded-xl
              bg-white
              border-2
              border-orange-400
              text-orange-400
              text-base
              font-medium
              hover:bg-white
              hover:text-orange-400
              hover:border-orange-400
              flex items-center gap-3 cursor-pointer
            "
          >
            <Image src={GoogleIcon} alt="google_icon" className="h-6 w-6" />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
