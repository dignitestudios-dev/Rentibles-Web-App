import RegisterForm from "@/src/components/auth/RegisterForm";

const Page = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center  overflow-hidden">
      <div
        className="
          w-full
          max-w-2xl
          h-full
          max-h-[92vh]
          bg-background
          rounded-2xl
          shadow-lg
          px-6
          py-5
          overflow-hidden
        "
      >
        <RegisterForm />
      </div>
    </div>
  );
};

export default Page;
