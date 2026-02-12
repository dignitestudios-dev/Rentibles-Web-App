"use client";
import React from "react";
import AppNavbar from "./_components/app-navbar";
import ProtectedRoute from "@/src/routes/ProtectedRoute";
import IdentityRoute from "@/src/routes/IdentityRoute";
import LocationPermission from "./_components/LocationPermission";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      {/* <IdentityRoute> */}
      <ProtectedRoute>
        <LocationPermission />
        <div className="px-4 sm:px-6 md:px-10 pb-5">
          <AppNavbar />
          {children}
        </div>
      </ProtectedRoute>
      {/* </IdentityRoute> */}
    </>
  );
};

export default AppLayout;
