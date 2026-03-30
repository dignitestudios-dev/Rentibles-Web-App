"use client";

import GoogleMapComponent from "@/src/components/common/GoogleMapPicker";
import { ErrorToast } from "@/src/components/common/Toaster";
import { getAddressFromLatLng } from "@/src/utils/helperFunctions";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLocationSuccess } from "@/src/lib/store/feature/locationSlice";

const libraries: Libraries = ["places"];

const LocationAndSearch = () => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState<string>("Loading...");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const onLocationSelect = (loc: any) => {
    const lat = loc.location.coordinates[1];
    const lng = loc.location.coordinates[0];

    const selectedAddress = loc.address || "";

    setLatLng({ lat, lng });
    dispatch(setLocationSuccess({ latitude: lat, longitude: lng }));
    setAddress(selectedAddress);

    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        dispatch(setLocationSuccess({ latitude, longitude }));
        setLatLng({ lat: latitude, lng: longitude });

        try {
          const addr = await getAddressFromLatLng(latitude, longitude);
          setAddress(addr);
        } catch (err) {
          ErrorToast(String(err));
          setAddress("");
        }
      },
      () => {
        setAddress("");
      },
    );
  }, [isLoaded, dispatch]);

  return (
    <>
      <div className="w-full flex justify-between gap-10">
        <div className="w-160">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="flex gap-2 text-sm items-center my-2"
          >
            <MapPin className="text-primary cursor-pointer size-4" />
            <span
              className={
                address === "Loading..." ? "text-muted-foreground" : ""
              }
            >
              {address}
            </span>
          </button>
        </div>

        <Link href="/app/search">
          <div className="bg-app rounded-sm p-2 flex items-center gap-2 w-80 max-w-full cursor-pointer">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Search</span>
          </div>
        </Link>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-lg w-[90%] max-w-2xl   z-50 p-2">
            <GoogleMapComponent
              onLocationSelect={onLocationSelect}
              latLng={latLng}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LocationAndSearch;
