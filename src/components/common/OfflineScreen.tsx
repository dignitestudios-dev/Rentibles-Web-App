"use client";

import React, { useEffect, useState } from "react";
import { Wifi, AlertCircle } from "lucide-react";

const OfflineScreen: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial connection status
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-10000 bg-background flex flex-col items-center justify-center">
      {/* WiFi Disconnected Icon */}
      <div className="mb-8">
        <Wifi className="w-20 h-20 text-orange-500 stroke-1" />
      </div>

      {/* Message */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
        Check Your Network or Try Again Later
      </h1>

      {/* Description */}
      <p className="text-foreground/60 text-center max-w-md mb-8 text-sm md:text-base">
        It seems you've lost your internet connection. Please check your network and try again.
      </p>

      {/* Loading Bar */}
      <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full animate-pulse" />
      </div>

      {/* Reconnecting Text */}
      <p className="text-foreground/50 text-xs md:text-sm mt-4">
        Reconnecting...
      </p>
    </div>
  );
};

export default OfflineScreen;
