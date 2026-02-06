"use client";

import React, { useEffect, useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PermissionState = "prompt" | "granted" | "denied" | "loading";

export default function LocationPermission() {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("loading");
  const [showDeniedDialog, setShowDeniedDialog] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      setPermissionState(permission.state as PermissionState);

      // Show prompt if permission hasn't been asked yet
      if (permission.state === "prompt") {
        setTimeout(() => setShowPrompt(true), 300);
      }

      // Listen for permission changes
      permission.addEventListener("change", () => {
        setPermissionState(permission.state as PermissionState);
      });
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      setPermissionState("prompt");
      setTimeout(() => setShowPrompt(true), 300);
    }
  };

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
            setShowDeniedDialog(true);
          }
        },
      );
    }
  };

  // Don't show anything if permission is granted
  if (permissionState === "granted" || permissionState === "loading") {
    return null;
  }

  return (
    <>
      {/* Location Permission Modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-3xl overflow-hidden">
            {/* Orange Gradient Background Container */}
            <div className="bg-linear-to-b from-orange-400 to-orange-500 p-6 sm:p-8 flex flex-col items-center justify-center min-h-96 text-white">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                No GPS Connection
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-orange-100 text-center mb-8">
                Please check you GPS settings
              </p>

              {/* Animated GPS Icon with Circles */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-8">
                {/* Outer circles */}
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse" />
                <div
                  className="absolute inset-4 rounded-full border-2 border-white/30 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="absolute inset-8 rounded-full border-2 border-white/20 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* Center Icon */}
                <div className="relative z-10 bg-orange-600 rounded-full p-4 sm:p-5 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <MapPin
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Button */}
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

      {/* Denied Permission Dialog */}
      <AlertDialog open={showDeniedDialog} onOpenChange={setShowDeniedDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <AlertDialogTitle>Location Permission Denied</AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="text-base">
            Location permission is disabled. To enable location services, please
            go to your site settings and allow location access for this website.
          </AlertDialogDescription>

          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mt-4 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-2">How to enable location:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the lock icon next to the URL</li>
              <li>Find "Location" in permissions</li>
              <li>Change from "Block" to "Allow"</li>
              <li>Refresh the page</li>
            </ol>
          </div>

          <div className="flex gap-3 mt-6">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-orange-500 hover:bg-orange-600 rounded-lg"
              onClick={() => window.location.reload()}
            >
              Try Again
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
