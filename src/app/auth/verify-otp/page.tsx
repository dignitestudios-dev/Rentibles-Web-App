import { Otp_Icon } from "@/public/images/export";
import VerifyOtpForm from "@/src/components/auth/VeriftOtpForm";
import Image from "next/image";

const page = () => {
  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125    rounded-[19px] bg-white">
      <Image src={Otp_Icon} alt="otp" className="w-40" />

      <h2 className="text-[24px] capitalize text-center font-bold my-4">
        Verify your email <br /> and phone number
      </h2>

      <VerifyOtpForm />
    </div>
  );
};

export default page;
