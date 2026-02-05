"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { IdentityFormValues, identitySchema } from "@/src/schema";
import { Camera_icon, Profile_img } from "@/public/images/export";
import { InputField } from "../common/InputField";
import { VerifyIdentityPayload } from "@/src/types/index.type";
import { useMutation } from "@tanstack/react-query";
import { IdentityVerification } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "../common/Toaster";
import { useRouter } from "next/navigation";
import { base64ToFile } from "@/src/utils/helperFunctions";
import CameraCapture from "./CameraIdentify";
import Loader from "../common/Loader";
import { useSelector } from "react-redux";
import { setUser } from "@/src/lib/store/feature/authSlice";
import { useDispatch } from "react-redux";
import { RootState } from "@/src/lib/store";

const IdentityVerificationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFaceCapture = (image: string) => {
    const file = base64ToFile(image, "face.jpg");
    setValue("face", file);
    setFacePreview(image);
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
  });

  const handleImage = (
    file: File,
    field: "face" | "front" | "back",
    previewSetter: (val: string) => void,
  ) => {
    setValue(field, file);
    previewSetter(URL.createObjectURL(file));
  };

  const onSubmit = (data: VerifyIdentityPayload) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("face", data.face);
    formData.append("front", data.front);
    formData.append("back", data.back);
    verifMutation.mutate(formData);
  };

  const verifMutation = useMutation({
    mutationFn: IdentityVerification,
    onSuccess: () => {
      if (user) {
        const updatedUser = { ...user, identityStatus: "pending" as const };
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      router.push("/dashboard/home");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Login failed");
      ErrorToast(message);
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <label
          onClick={() => setShowCamera(true)}
          className="flex flex-col mt-2 gap-2 cursor-pointer"
        >
          {facePreview ? (
            <div className="flex items-center gap-5">
              <div className="h-19.5 w-19.5 rounded-full border-2 border-dashed border-orange-500 overflow-hidden">
                <Image
                  src={facePreview}
                  alt="Face"
                  width={78}
                  height={78}
                  className="object-cover w-full h-full"
                />
              </div>

              <h2 className="text-[15px] text-orange-500 font-medium">
                Retake
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Image src={Profile_img} alt="profile" width={78} height={78} />
              <h2 className="text-[15px]">Take Selfie</h2>
            </div>
          )}
        </label>

        <div>
          <InputField placeholder="Legal Name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="cursor-pointer">
            <div className="h-32 border-2 border-[#959393] rounded-xl flex items-center justify-center overflow-hidden">
              {frontPreview ? (
                <Image
                  src={frontPreview}
                  alt="Front"
                  width={150}
                  height={150}
                />
              ) : (
                <Image src={Camera_icon} alt="camera_icon" width={50} />
              )}
            </div>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                handleImage(e.target.files[0], "front", setFrontPreview)
              }
            />
            {errors.front && (
              <p className="text-red-500 text-xs mt-1">
                {errors.front.message}
              </p>
            )}
          </label>

          <label className="cursor-pointer">
            <div className="h-32 rounded-xl border-2 border-[#959393] flex items-center justify-center overflow-hidden">
              {backPreview ? (
                <Image src={backPreview} alt="Back" width={150} height={150} />
              ) : (
                <Image src={Camera_icon} alt="camera_icon" width={50} />
              )}
            </div>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                handleImage(e.target.files[0], "back", setBackPreview)
              }
            />
            {errors.back && (
              <p className="text-red-500 text-xs mt-1">{errors.back.message}</p>
            )}
          </label>
        </div>
        <Loader show={verifMutation.isPending} />
        <Button
          type="submit"
          disabled={verifMutation.isPending}
          className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 h-12 text-lg"
        >
          Submit
        </Button>
        {showCamera && (
          <CameraCapture
            onCapture={handleFaceCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </form>
    </>
  );
};

export default IdentityVerificationPage;
