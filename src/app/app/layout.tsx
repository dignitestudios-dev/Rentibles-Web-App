import React from "react";
import AppNavbar from "./_components/app-navbar";
import LocationPermission from "./_components/LocationPermission";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <LocationPermission />
      <div className="px-4 sm:px-6 md:px-10 pb-5">
        <AppNavbar />
        {children}
      </div>
    </>
  );
};

export default AppLayout;

