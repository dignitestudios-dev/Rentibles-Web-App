"use client";

import { ErrorToast } from "@/src/components/common/Toaster";
import { getAddressFromLatLng } from "@/src/utils/helperFunctions";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setLocationSuccess } from "@/src/lib/store/feature/locationSlice";

const libraries: Libraries = ["places"];

interface LocationAndSearchProps {
  onOpenModal: () => void;
  latLng: { lat: number; lng: number } | null;
}

const LocationAndSearch = ({ onOpenModal, latLng }: LocationAndSearchProps) => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState<string>("Loading...");
  const [hasLoadedLocation, setHasLoadedLocation] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handleLocationClick = useCallback(() => {
    onOpenModal();
  }, [onOpenModal]);

  useEffect(() => {
    if (!isLoaded || hasLoadedLocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        dispatch(setLocationSuccess({ latitude, longitude }));

        try {
          const addr = await getAddressFromLatLng(latitude, longitude);
          setAddress(addr);
        } catch (err) {
          ErrorToast(String(err));
          setAddress("");
        }

        setHasLoadedLocation(true);
      },
      () => {
        setAddress("");
        setHasLoadedLocation(true);
      },
    );
  }, [isLoaded, dispatch, hasLoadedLocation]);

  // Update address when latLng changes from parent
  useEffect(() => {
    if (latLng) {
      const updateAddress = async () => {
        try {
          const addr = await getAddressFromLatLng(latLng.lat, latLng.lng);
          setAddress(addr);
        } catch (err) {
          ErrorToast(String(err));
        }
      };
      updateAddress();
    }
  }, [latLng]);

  return (
    <div className="w-full flex justify-between gap-10">
      <div className="w-160 cursor-pointer">
        <button
          onClick={handleLocationClick}
          type="button"
          className="flex gap-2 text-sm items-center my-2"
        >
          <MapPin className="text-primary cursor-pointer size-4" />
          <span
            className={
              address === "Loading..."
                ? "text-muted-foreground cursor-pointer"
                : "cursor-pointer"
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
  );
};

export default LocationAndSearch;