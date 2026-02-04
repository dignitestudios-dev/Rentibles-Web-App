"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { IdentityFormValues, identitySchema } from "@/src/schema";
import { Camera_icon, Profile_img } from "@/public/images/export";
import { InputField } from "../common/InputField";
import ProfileStatus from "./ProfileStatus";

const IdentityVerificationPage = () => {
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState(false);

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
    field: "faceImage" | "frontImage" | "backImage",
    previewSetter: (val: string) => void,
  ) => {
    setValue(field, file);
    previewSetter(URL.createObjectURL(file));
  };

  const onSubmit = (data: IdentityFormValues) => {
    console.log("Verified Data:", data);
    setProfileStatus(true);
  };

  return (
    <>
      {profileStatus ? (
        <ProfileStatus />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          <label className="flex flex-col mt-2 gap-2 cursor-pointer">
            {facePreview ? (
              <div className="h-19.5 w-19.5 rounded-full border-2 border-dashed border-orange-500 flex items-center justify-center overflow-hidden">
                <Image
                  src={facePreview}
                  alt="Face"
                  width={138}
                  height={128}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Image src={Profile_img} alt="profile_placeholder" width={78} />
                <h2 className="text-[15px]">Face Image</h2>
              </div>
            )}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                handleImage(e.target.files[0], "faceImage", setFacePreview)
              }
            />
            {errors.faceImage && (
              <p className="text-red-500 text-xs">{errors.faceImage.message}</p>
            )}
          </label>

          <div>
            <InputField placeholder="Legal Name" {...register("legalName")} />
            {errors.legalName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.legalName.message}
              </p>
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
                  handleImage(e.target.files[0], "frontImage", setFrontPreview)
                }
              />
              {errors.frontImage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.frontImage.message}
                </p>
              )}
            </label>

            <label className="cursor-pointer">
              <div className="h-32 rounded-xl border-2 border-[#959393] flex items-center justify-center overflow-hidden">
                {backPreview ? (
                  <Image
                    src={backPreview}
                    alt="Back"
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
                  handleImage(e.target.files[0], "backImage", setBackPreview)
                }
              />
              {errors.backImage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.backImage.message}
                </p>
              )}
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
          >
            Submit
          </Button>
        </form>
      )}
    </>
  );
};

export default IdentityVerificationPage;
