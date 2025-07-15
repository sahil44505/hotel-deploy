"use client";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Container from "@/app/components/navbar/Container"
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingBookings from "@/app/components/listings/ListingBookings";
import { categories } from "@/app/constants/categories";

import { SafeListings, SafeBookings, SafeUser } from "@/app/types";
import axios from "axios";
import { Range } from "react-date-range";

import { Toaster, toast } from "sonner";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  bookings?: SafeBookings[];
  listing: SafeListings & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  bookings = [],
  currentUser,
}) => {
  const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
   
  const handleGuestChange = (newRooms: number, newAdults: number, newChildren: number) => {
    setRooms(newRooms);
    setAdults(newAdults);
    setChildren(newChildren);
  };
  
 

  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    bookings
      .filter((booking: any) => booking.title === listing.title) // Only match the current listing's title
      .forEach((booking: any) => {
        const range = eachDayOfInterval({
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
        });

        dates = [...dates, ...range];
      });

    return dates;
  }, [bookings, listing.title]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const cor:any = listing.gps_coordinates

const formattedGpsCoordinates = {
  latitude: Number(cor.latitude) || 0, // Convert to number, default to 0 if invalid
  longitude: Number(cor.longitude) || 0, // Convert to number, default to 0 if invalid
};

  const onCreateBookings = useCallback(() => {
    if (!currentUser) {
      toast.error("You need to be logged in to make a booking")
    }

    setIsLoading(true);
    console.log(firstImage)

    axios
      .post(`/api/bookings`, {
        img:firstImage,
        title: listing.title,
        totalPrice,
        gps_coordinates:formattedGpsCoordinates,
        startDate: dateRange.startDate ? new Date(Date.UTC(
          dateRange.startDate.getFullYear(),
          dateRange.startDate.getMonth(),
          dateRange.startDate.getDate(),
          0, 0, 0
        )) : null, // Reset to midnight UTC
        endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(23, 59, 59, 999)) : null,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success("Listing reserved!");
        setDateRange(initialDateRange);
        // router.push("/trips");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, router, currentUser]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
  
      if (dayCount && listing.price) {
        const roomMultiplier = rooms; // Charge based on rooms
        const adultMultiplier = adults; // Each adult adds full price
        const childMultiplier = children * 0.5; // Example: Children cost 50% of an adult
  
        setTotalPrice(dayCount * listing.price * (roomMultiplier + adultMultiplier + childMultiplier));
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price, rooms, adults, children]);
 

  const [firstImage, setFirstImage] = useState<string | null>(null);



console.log(firstImage)
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            amenities={listing.amenities}
            type={listing.type}
            title={listing.title}
            setFirstImage={setFirstImage}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-7 md:gap-10">
            <ListingInfo
              user={listing.user}
              bathroomCount={listing.bathroomCount}
              roomCount={listing.roomCount}
              
              beds={listing.beds ?? 1}
             
              gps_coordinates={formattedGpsCoordinates}


              description={listing.description}
            />
            <div className="mb-10 md:order-list md:col-span-3">
              <ListingBookings
                price={listing.price}
                rooms={rooms}
                adults={adults}
                children={children}
                onGuestChange={handleGuestChange}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateBookings}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
