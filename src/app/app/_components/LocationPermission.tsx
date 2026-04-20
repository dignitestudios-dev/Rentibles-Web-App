"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type PermissionState = "prompt" | "granted" | "denied" | "loading";

export default function LocationPermission() {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("loading");
  const [showPrompt, setShowPrompt] = useState(false);

  const updatePermissionState = (state: PermissionState) => {
    setPermissionState(state);
    setShowPrompt(state === "prompt");
  };

  const checkLocationPermission = useCallback(async () => {
    if (!navigator.permissions) {
      setPermissionState("prompt");
      setShowPrompt(true);
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      updatePermissionState(permission.state as PermissionState);

      permission.addEventListener("change", () => {
        updatePermissionState(permission.state as PermissionState);
      });
    } catch {
      setPermissionState("prompt");
      setShowPrompt(true);
    }
  }, []);

  useEffect(() => {
    const initCheck = () => {
      checkLocationPermission();
    };

    Promise.resolve().then(initCheck);

    const handleFocus = () => {
      checkLocationPermission();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleFocus);
    };
  }, [checkLocationPermission]);

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionState("granted");
          setShowPrompt(false);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setPermissionState("denied");
            setShowPrompt(false);
          }
        },
      );
    }
  };

  // Don't show anything if permission is granted or still resolving
  if (permissionState === "granted" || permissionState === "loading") {
    return null;
  }

  const isDenied = permissionState === "denied";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden">
            <div className="bg-linear-to-b from-orange-400 to-orange-500 p-6 sm:p-8 flex flex-col items-center justify-center min-h-96 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                No GPS Connection
              </h2>
              <p className="text-sm sm:text-base text-orange-100 text-center mb-8">
                Please enable location services to continue using the app.
              </p>
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse" />
                <div
                  className="absolute inset-4 rounded-full border-2 border-white/30 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="absolute inset-8 rounded-full border-2 border-white/20 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
                <div className="relative z-10 bg-orange-600 rounded-full p-4 sm:p-5 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <MapPin
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <Button
                onClick={handleRequestLocation}
                className="w-full bg-white hover:bg-gray-100 text-gray-900! font-semibold py-6 rounded-xl text-base sm:text-lg transition-colors"
              >
                Check GPS Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDenied && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto rounded-3xl bg-background p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold">
                Location Permission Denied
              </h2>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              Location permission is disabled. You must allow location access to
              use the app.
            </p>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mt-2 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-2">How to enable location:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the lock icon next to the URL</li>
                <li>Find &quot;Location&quot; in permissions</li>
                <li>Change from &quot;Block&quot; to &quot;Allow&quot;</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
