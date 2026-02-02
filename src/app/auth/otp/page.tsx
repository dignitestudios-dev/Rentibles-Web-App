import Image from "next/image";
import { Otp_Icon } from "@/public/images/export";
import OtpForm from "@/src/components/auth/Otp";

const Page = () => {
  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125  rounded-[19px] bg-white">
      <Image src={Otp_Icon} alt="otp" className="w-40" />

      <h2 className="text-3xl font-bold mt-6">Verify OTP</h2>

      <p className="text-gray-400 mt-2 text-center">
        The code was sent to{" "}
        <span className="text-black font-normal">seller17@yopmail.com</span>
      </p>

      <OtpForm />
    </div>
  );
};

export default Page;
