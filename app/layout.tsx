import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import getCurrentUser from "./actions/getCurrentUser";
import { Toaster } from "sonner";
import { TripProvider } from "@/context/Tripscontext";
import { HotelProvider } from "@/context/Hotelscontext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currentUser: any = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <HotelProvider>
      <TripProvider>
        <Navbar currentUser={currentUser} />
        <main>{children}</main>
        </TripProvider>
        </HotelProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
