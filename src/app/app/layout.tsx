import React from "react";
import AppNavbar from "./_components/app-navbar";
import ProtectedRoute from "@/src/routes/ProtectedRoute";
import IdentityRoute from "@/src/routes/IdentityRoute";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    // <IdentityRoute>
    <ProtectedRoute>
      <div className="px-10 py-5">
        <AppNavbar />
        {children}
      </div>
    </ProtectedRoute>
    // </IdentityRoute>
  );
};

export default AppLayout;
