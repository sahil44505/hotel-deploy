'use client'
import { createContext, useContext, useState } from "react";

interface HotelData {
  position: number;
  title: string;
  thumbnail: string;
  tracking_link: string;
}

interface HotelsContextType {
  Hotel: { ads: HotelData[] };
  setHotel: (hotels: { ads: HotelData[] }) => void;
}

const HotelContext = createContext<HotelsContextType | null>(null);

export const HotelProvider = ({ children }: { children: React.ReactNode }) => {
  const [Hotel, setHotel] = useState<{ ads: HotelData[] }>({ ads: [] });

  return (
    <HotelContext.Provider value={{ Hotel, setHotel }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};
