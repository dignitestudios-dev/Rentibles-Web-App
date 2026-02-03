import { Button } from "@/components/ui/button";
import { GoogleIcon, OrangeLogo } from "@/public/images/export";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className="w-full h-auto flex justify-center">
      <div className="w-full flex flex-col items-center p-6 md:w-125 rounded-[19px] bg-white">
        <Image src={OrangeLogo} alt="orange_logo" className="w-27" />

        <div className="w-full max-w-md flex flex-col gap-4 mt-10">
          <Link
            href="/auth/login"
            className="
              h-14
              w-full
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
              flex
              items-center
              justify-center
            "
          >
            Continue with Email
          </Link>

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
              flex
              items-center
              justify-center
              gap-3
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
