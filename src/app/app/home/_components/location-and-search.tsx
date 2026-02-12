"use client";

import { ErrorToast } from "@/src/components/common/Toaster";
import { getAddressFromLatLng } from "@/src/utils/helperFunctions";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const libraries: Libraries = ["places"];

const LocationAndSearch = () => {
  const [address, setAddress] = useState<string>("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      if (!isLoaded) return;
      const { latitude, longitude } = position.coords;

      try {
        const addr = await getAddressFromLatLng(latitude, longitude);
        setAddress(addr);
      } catch (err) {
        ErrorToast(String(err));
      }
    });
  }, [isLoaded]);

  return (
    <div className="w-full flex justify-between gap-10">
      <div className="flex gap-2 text-sm items-center">
        <MapPin className="text-primary size-4" /> <span>{address}</span>
      </div>

      <Link href="/app/search">
        <div className="bg-app rounded-sm p-2 flex items-center gap-2 w-80 max-w-full cursor-pointer">
          <Search className="size-4 text-muted-foreground" />{" "}
          <span className="text-muted-foreground">Search</span>
        </div>
      </Link>
    </div>
  );
};

export default LocationAndSearch;
