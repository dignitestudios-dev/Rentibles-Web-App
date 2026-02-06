import { Orange_tick } from "@/public/images/export";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setVerified } from "@/src/lib/store/feature/authSlice";

const AcountVerified = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(setVerified(true));
      redirect("/auth/identity-verification");
    }, 2000);
  }, []);
  return (
    <div className="flex  flex-col items-center h-75 justify-center">
      <Image src={Orange_tick} alt="orange_tick" width={125} />
      <h2 className="text-[28px] font-bold mt-4">Account Created</h2>
      <p className="text-[15px] font-normal ">
        Your account has been created successfully!
      </p>
    </div>
  );
};

export default AcountVerified;
