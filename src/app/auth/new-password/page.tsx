import { ForgotPassword } from "@/public/images/export";
import NewPasswordForm from "@/src/components/auth/NewPasswordForm";
import Image from "next/image";

const page = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center px-6 py-8 md:w-125 rounded-[19px] bg-white">
      <Image src={ForgotPassword} alt="forgot_password" className="w-37" />

      <div className="w-full flex flex-col mt-6 items-center text-center">
        <h2 className="text-[32px] font-bold leading-10">Set New Password</h2>

        <p className="text-[16px] mt-3 max-w-sm text-[#3C3C43D9] leading-5.5">
          Set New Password so you can login and access{" "}
          <span className="font-bold text-black">RentalBay</span>
        </p>
      </div>
      <NewPasswordForm />
    </div>
  );
};

export default page;
