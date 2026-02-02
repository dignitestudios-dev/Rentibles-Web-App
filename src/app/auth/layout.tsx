"use client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <PublicRoute>
    <div className="w-screen h-screen flex justify-center items-center auth_bg ">
      {" "}
      {children}
    </div>
    // </PublicRoute>
  );
}
