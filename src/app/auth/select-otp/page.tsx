import SelectOtp from "@/src/components/auth/SelectOtp";

const page = () => {
  return (
    <div className="w-full flex flex-col items-center p-6 justify-center md:w-125  rounded-[19px] bg-background">
      <SelectOtp />
    </div>
  );
};

export default page;
