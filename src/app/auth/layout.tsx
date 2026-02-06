"use client";

import PublicRoutes from "@/src/routes/PublicRoutes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicRoutes>
      <div className="w-screen h-screen flex justify-center items-center auth_bg ">
        {" "}
        {children}
      </div>
    </PublicRoutes>
  );
}
