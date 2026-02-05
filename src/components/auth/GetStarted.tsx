"use client";
import { Button } from "@/components/ui/button";
import { GoogleIcon, OrangeLogo } from "@/public/images/export";
import { socialRegister } from "@/src/lib/query/queryFn";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ErrorToast, SuccessToast } from "../common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/src/firebase/firebase";
import Loader from "../common/Loader";
import { useDispatch } from "react-redux";
import { singUp } from "@/src/lib/store/feature/authSlice";
import { useRouter } from "next/navigation";

const GetStarted = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const googlemutation = useMutation({
    mutationFn: socialRegister,
    onSuccess: (response) => {
      const userInfo = response?.data;

      dispatch(
        singUp({
          token: {
            access: userInfo.token,
            refresh: userInfo.token,
          },
          user: userInfo.user,
        }),
      );
      SuccessToast(response?.message);
      router.push("/auth/identity-verification");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      ErrorToast(message);
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      googlemutation.mutate({ idToken, role: "user" });
    } catch (err) {
      console.error(err);
      ErrorToast("Google login failed");
    }
  };
  return (
    <div className="w-full h-auto flex justify-center">
      <div className="w-full flex flex-col items-center p-6 md:w-125 rounded-[19px] bg-white">
        <Image src={OrangeLogo} alt="orange_logo" className="w-27" />

        <div className="w-full max-w-md flex flex-col gap-4 mt-10">
          <Link
            href="/auth/login"
            className="
              h-14
              w-full
              rounded-xl
              bg-white
              border-2
              border-orange-400
              text-orange-400
              text-base
              font-medium
              hover:bg-white
              hover:text-orange-400
              hover:border-orange-400
              flex
              items-center
              justify-center
            "
          >
            Continue with Email
          </Link>
          <Loader show={googlemutation.isPending} />
          <Button
            className="
              h-14
              rounded-xl
              bg-white
              border-2
              border-orange-400
              text-orange-400
              text-base
              font-medium
              hover:bg-white
              hover:text-orange-400
              hover:border-orange-400
              cursor-pointer
            "
          >
            Continue with Guest Mode
          </Button>

          <Button
            className="
              h-14
              rounded-xl
              bg-white
              border-2
              border-orange-400
              text-orange-400
              text-base
              font-medium
              hover:bg-white
              hover:text-orange-400
              hover:border-orange-400
              flex
              items-center
              justify-center
              gap-3
              cursor-pointer
            "
            disabled={googlemutation.isPending}
            onClick={handleGoogleLogin}
          >
            <Image src={GoogleIcon} alt="google_icon" className="h-6 w-6" />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
