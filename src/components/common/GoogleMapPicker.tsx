"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";

type LocationData = {
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
};

type GoogleMapProps = {
  onLocationSelect: (data: LocationData) => void;
  editAddress?: LocationData | null;
  distance?: number;
  showRadius?: boolean;
  isDisabled?: boolean;
  error?: string;
  isClear?: boolean;
};

const containerStyle = {
  width: "100%",
  height: "194px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const libraries: Libraries = ["places"];

const GoogleMapComponent = ({
  onLocationSelect,
  editAddress = null,
  distance = 1,
  showRadius = false,
  isDisabled = false,
  error = "",
  isClear = false,
}: GoogleMapProps) => {
  const radiusInMeters = distance * 1609.34;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(defaultCenter);
  const [inputValue, setInputValue] = useState("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (isClear) setInputValue("");
  }, [isClear]);

  useEffect(() => {
    if (editAddress?.location?.coordinates?.length === 2) {
      const [lng, lat] = editAddress.location.coordinates;
      setMapCenter({ lat, lng });
      setMarker({ lat, lng });
      setInputValue(editAddress.address || "");
    }
  }, [editAddress]);

  if (!isLoaded) {
    return (
      <div className="flex h-48.5 items-center justify-center text-sm text-gray-400">
        Loading map...
      </div>
    );
  }

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const components = place.address_components || [];

    const getComponent = (types: string[]) =>
      components.find((c) => types.some((type) => c.types.includes(type)))
        ?.long_name || "";

    const data: LocationData = {
      country: getComponent(["country"]),
      state: getComponent(["administrative_area_level_1"]),
      city: getComponent([
        "locality",
        "postal_town",
        "administrative_area_level_2",
        "sublocality",
      ]),
      zipCode: getComponent(["postal_code"]),
      address: place.formatted_address,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    setMapCenter({ lat, lng });
    setMarker({ lat, lng });
    setInputValue(place.formatted_address || "");

    onLocationSelect(data);
  };

  return (
    <div className="relative w-full h-full">
      <Autocomplete
        onLoad={(auto) => (autocompleteRef.current = auto)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          value={inputValue}
          disabled={isDisabled}
          placeholder="Enter your street, city, state, zip"
          className="mb-2 w-full rounded-md border text-foreground border-gray-300 p-2 text-sm"
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);

            if (!value) {
              onLocationSelect({
                address: "",
                city: "",
                country: "",
                state: "",
                zipCode: "",
                location: { type: "Point", coordinates: [] },
              });
            }
          }}
        />
      </Autocomplete>

      {error && (
        <p className="mb-1 text-[12px] font-medium text-red-500">{error}</p>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={showRadius ? 8 : 14}
      >
        {showRadius ? (
          <Circle
            center={mapCenter}
            radius={radiusInMeters}
            options={{
              fillColor: "#29ABE2",
              fillOpacity: 0.2,
              strokeColor: "#29ABE2",
              strokeOpacity: 0.5,
              strokeWeight: 1,
            }}
          />
        ) : (
          <Marker position={marker} />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
