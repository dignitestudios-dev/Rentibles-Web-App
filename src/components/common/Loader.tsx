import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-18 w-18 animate-spin text-black" />
        <p className="text-xl font-bold ">Loading ...</p>
      </div>
    </div>
  );
};

export default Loader;
