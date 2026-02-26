import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { ReduxProvider } from "../lib/store/provider";
import ThemeProvider from "../lib/theme/ThemeProvider";
import ReactQueryProvider from "../lib/query/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { LoginRequiredProvider } from "../lib/auth/LoginRequiredProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Rentibles",
  description: "Your Gateway to Limitless Possibilities!",
  icons: {
    icon: "/images/orange_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider>
          <ReduxProvider>
            <ReactQueryProvider>
              <LoginRequiredProvider>
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 3000,
                  }}
                />
                {children}
              </LoginRequiredProvider>
            </ReactQueryProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
