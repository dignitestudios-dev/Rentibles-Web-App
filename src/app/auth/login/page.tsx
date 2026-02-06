import Image from "next/image";
import { OrangeLogo } from "@/public/images/export";
import LoginForm from "@/src/components/auth/LoginForm";

const Page = () => {
  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125    rounded-[19px] bg-background">
      <Image src={OrangeLogo} alt="orange_logo" className="w-37" />
      <div className="w-auto flex flex-col mt-4 justify-center items-center">
        <h2 className="text-[32px] font-bold leading-12 ">Welcome Back</h2>
        <p className="text-[18px] font-normal text-center leading-12 ">
          Please enter your details to continue
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Page;
