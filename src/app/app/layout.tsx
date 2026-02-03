import React from "react";
import AppNavbar from "./_components/app-navbar";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-5">
      <AppNavbar />
      {children}
    </div>
  );
};

export default AppLayout;
