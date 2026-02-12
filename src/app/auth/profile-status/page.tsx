import ProfileStatus from "@/src/components/auth/ProfileStatus";

const Page = () => {
  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125  h-125   rounded-[19px] bg-background">
      <ProfileStatus />
    </div>
  );
};

export default Page;
