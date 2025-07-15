"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import HotelCard from "./HotelCard"; // adjust the path if needed
import { useSearchParams } from "next/navigation";

interface HotelCardComponentProps {
  title: string;
  bookings: any[];
  currentUser: any;
}

export default function HotelCardComponent({
  title,
  bookings,
  currentUser,
}: HotelCardComponentProps) {
  // Use useSearchParams to extract query parameters (client-side)
  const searchParams = useSearchParams();
  const checkInParam = searchParams.get("checkInDate");
  const checkOutParam = searchParams.get("checkOutDate");
  

  // Convert query parameters to Date objects (or use defaults)
  const checkIn = checkInParam ? checkInParam : new Date();
 
  const checkOut = checkOutParam ?  checkOutParam: new Date();
console.log(title)
  const [hotelData, setHotelData] = useState<any>(null);

  useEffect(() => {
    async function fetchHotelDetails() {
      try {
        const res = await axios.post("/api/hoteldetail", {
          title,
          checkIn,
          checkOut,
        });
        setHotelData(res.data);
      } catch (error: any) {
        console.error("Error fetching hotel details:", error);
      }
    }
    fetchHotelDetails();
  }, [title, checkIn, checkOut]);

  if (!hotelData) return <p>Loading...</p>;

  return (
    <HotelCard
      hotel={hotelData}
      checkIn={checkIn}
      checkOut={checkOut}
      bookings={bookings}
    />
  );
}
