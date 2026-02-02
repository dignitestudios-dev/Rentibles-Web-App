import React from "react";
import AppNavbar from "./_components/app-navbar";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="px-10 py-5">
      <AppNavbar />
      {children}
    </div>
  );
};

export default AppLayout;
