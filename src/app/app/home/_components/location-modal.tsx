import React, { useCallback } from "react";
import GoogleMapComponent from "@/src/components/common/GoogleMapPicker";
import { useDispatch } from "react-redux";
import { setLocationSuccess } from "@/src/lib/store/feature/locationSlice";
import { Button } from "@/components/ui/button";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  latLng: { lat: number; lng: number } | null;
}

const LocationModal = ({
  isOpen,
  onClose,
  onLocationSelect,
  latLng,
}: LocationModalProps) => {
  const dispatch = useDispatch();

  const handleLocationSelect = useCallback(
    (loc: any) => {
      const lat = loc.location.coordinates[1];
      const lng = loc.location.coordinates[0];
      const selectedAddress = loc.address || "";

      dispatch(setLocationSuccess({ latitude: lat, longitude: lng }));
      onLocationSelect(lat, lng, selectedAddress);
    },
    [dispatch, onLocationSelect],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg w-[90%] max-w-2xl z-50 p-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          ✕
        </button>

        <GoogleMapComponent
          onLocationSelect={handleLocationSelect}
          latLng={latLng}
        />
        <div className="flex justify-center">
        <Button onClick={()=>onClose()} className="text-white w-full mt-3 " >
          Done
        </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;