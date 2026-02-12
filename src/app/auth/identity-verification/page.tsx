import { Identity_Verification } from "@/public/images/export";
import IdentityVerificationPage from "@/src/components/auth/IdentityVerificationForm";
import Logout from "@/src/components/common/Logout";
import Image from "next/image";

const page = () => {
  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125    rounded-[19px] bg-background">
      <div>
        <Logout />
      </div>
      <Image
        src={Identity_Verification}
        alt="Identity_Verification"
        width={142}
      />
      <h1 className="text-[24px] font-semibold text-center">
        Identity Verification
      </h1>
      <p className="text-[#959393] text-[12px] ">
        Take a Front and Back Image to Continue
      </p>
      <IdentityVerificationPage />
    </div>
  );
};

export default page;
