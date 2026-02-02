"use client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <PublicRoute>
    <div className="w-screen min-h-screen  flex justify-center items-center auth_bg p-3 md:py-8">
      {children}
    </div>
    // </PublicRoute>
  );
}
