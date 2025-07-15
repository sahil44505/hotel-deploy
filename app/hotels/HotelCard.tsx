'use client'
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import GuestSelector from "./[title]/GuestHotelSelector";
import DateRangePicker from "../components/DateRangePicker";

import GoogleMap from "../components/GoogleMaps";
import { differenceInDays, eachDayOfInterval } from "date-fns"; // Import date difference function
import Payment from "../components/Payment";
import axios from "axios";
import { toast } from "sonner";
import getbookings from "../actions/getbookings";
interface HotelData {
  extracted_hotel_class: number;
  name: string;
  address: string;
  overall_rating: number;
  reviews: number;
  location_rating: number;
  check_in_time: string;
  check_out_time: string;
  description: string;
  hotel_class: string;
  phone: string;
  phone_link: string;
  link: string;
  gps_coordinates: { latitude: number; longitude: number };
  reviews_breakdown?: { name: string; description: string; total_mentioned: number; positive: number; negative: number }[];
  ratings?: { stars: number; count: number }[];
  nearby_places?: { name: string; link: string; thumbnail: string; description: string; rating: number; reviews: number }[];
  prices?: { source: string; link: string; logo: string; rate_per_night?: { lowest: string; extracted_lowest: number; extracted_before_taxes_fees: number } }[];
  featured_prices?: {
    remarks: any; source: string; link: string; logo: string; rate_per_night?: { lowest: string; extracted_lowest: number; }
  }[];

  images?: { thumbnail: string; original_image: string }[];
 



}


const HotelCard: React.FC<{ hotel: HotelData, checkIn: string | Date, checkOut: string | Date , bookings : any[]}> = ({ hotel, checkIn, checkOut  ,bookings}) => {

  interface DateRange {
    startDate: Date;
    endDate: Date;
    key: string;
  }
  
  const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [images,setImages] =  useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const disabledDates = useMemo(() => {
   
      let dates: Date[] = [];
      bookings
      .filter((booking: any) => booking.title === hotel.name)
      .forEach((booking: any) => {
        const range = eachDayOfInterval({
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
        });
        dates = [...dates, ...range];
      });
  
    return dates;
  }, [bookings, hotel.name]);
  
  
  const handleDateChange = (range: any) => {
    setDateRange({
      startDate: range.startDate || new Date(),
      endDate: range.endDate || new Date(),
      key: range.key || "selection",
    });

  };
  useEffect(() => {
 
  }, [dateRange]);

  const handleGuestChange = (newRooms: number, newAdults: number, newChildren: number) => {
    setRooms(newRooms);
    setAdults(newAdults);
    setChildren(newChildren);
 
  };
  useEffect(() => {
    if (!hotel.prices || hotel.prices.length === 0) {
      setTotalPrice(0);
      return;
    }

    const nights = Math.max(1, differenceInDays(dateRange.endDate, dateRange.startDate)); // Ensure at least 1 night
    const basePricePerNight = hotel.prices[0].rate_per_night?.extracted_before_taxes_fees || 0;

    const calculatedTotal = nights * basePricePerNight * rooms;
    setTotalPrice(calculatedTotal);
  }, [dateRange, rooms, hotel.prices]);

  const [firstImage, setFirstImage] = useState<string | null>('');

  useEffect(()=>{
    const getImages = async () => {
      try {
        console.log("Fetching images...", hotel.name);
        const title = hotel.name
        
        await new Promise((res) => setTimeout(res, 2000)); // Simulated delay
       
        const response = await axios.post("/api/imageshotel", { title });
        const images = response.data || response;
    
        if (!images || images.length === 0) {
          console.log("No hotels found");
          return;
        }
    
        setImages(images);
        setFirstImage(images[0]);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    getImages();
  },[])
  console.log(firstImage)
  const onSubmit=async()=>{
    const title =hotel.name
    const rating=hotel.overall_rating
   
    console.log(firstImage)
    const res:any = await axios
    .post(`/api/bookings`, {
      img:firstImage,
      title: title,
      totalPrice,
      gps_coordinates:hotel.gps_coordinates,
      rating,
      startDate: dateRange.startDate ? new Date(Date.UTC(
        dateRange.startDate.getFullYear(),
        dateRange.startDate.getMonth(),
        dateRange.startDate.getDate(),
        0, 0, 0
      )) : null, // Reset to midnight UTC
      endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(23, 59, 59, 999)) : null,
    
    })
    .then(() => {
      toast.success("Listing reserved!");
      setDateRange(initialDateRange);
      // router.push("/trips");
    })
    .catch(() => {
      toast.error("Something went wrong");
    })


  }
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        {/* Hotel Header */}
        <h1 className="text-3xl font-bold text-black">{hotel.name}</h1>
        <p className=" mt-2 text-black">{hotel.reviews} reviews | {hotel.extracted_hotel_class}-star hotel</p>
        <p className="text-gray-900">📍 {hotel.address}</p>
        <div className="flex items-center space-x-4 mt-2 text-grey-500">
          <a href={`${hotel.link}`} className="hover:underline">Visit hotel website</a>
          <span>|</span>
          <a href={hotel.phone_link} className="hover:underline">{hotel.phone}</a>
        </div>

        {/* Image Gallery */}
        <div className="mt-4 ">
           <div className="w-[50vw] h-[60vh] m-20 flex flex-col items-center justify-center relative">
                  {images.length > 0 ? (
                    <>
                      {/* Main Image */}
                      <div className="absolute left-0 h-[60vh] w-full shadow-md transition-transform duration-200">
                        <Image 
                          className="w-full h-full object-cover rounded-lg"
                          src={images[currentIndex]}
                          alt={`Hotel Image ${currentIndex + 1}`}
                          width={800}
                          height={500}
                          priority
                        />
                      </div>
          
                      {/* Dots Navigation */}
                      <div className="flex gap-2 mt-4 absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        {images.map((__, index) => (
                          <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              currentIndex === index ? "bg-black scale-110" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500">No images available</p>
                  )}
                </div>
        </div>

        {/* Check Availability Button */}


        {/* Booking Section */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold">View prices for your travel dates</h2>
          <div className="flex justify-end gap-2">
            <div className=" w-[13vw] mb-3 pb-3 relative bottom-[3vh]">
            <Payment totalPrice={totalPrice} onSubmit={onSubmit} />
            </div>
            <p className="text-lg font-bold mt-2  text-black">   Total Price: $
              {(dateRange.startDate === new Date() && dateRange.endDate === new Date() && rooms === 1 && adults <= 6 && children <= 2)
                ? (hotel.prices?.[0]?.rate_per_night?.extracted_before_taxes_fees || "N/A")
                : (() => {
                  let adjustedPrice = totalPrice;
                  if (adults > 6) adjustedPrice *= 1.1; // Increase by 10% if more than 6 adults
                  if (children > 2) adjustedPrice *= 1.05; // Increase by 5% if more than 2 children
                  return adjustedPrice.toFixed(2);
                })()
              }</p>
          </div>
          <div className="flex items-center  gap-4 mt-2">
            <div>
              <DateRangePicker onDateChange={handleDateChange} disabledDates={disabledDates} />
            </div>
            <div>

              <GuestSelector rooms={rooms} adults={adults} children={children} onChange={handleGuestChange} />

            </div>

          </div>
          {/* <p className="text-red-500 mt-2 text-sm">We're sorry, this hotel is not available on TripAdvisor for the selected dates.</p> */}


        </div>

        {/* Options Section */}
        {hotel.prices && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Options</h2>
            {hotel.prices.slice(0, 5).map((option, index) => (
              <div key={index} className="mt-4 flex justify-between items-center border p-4 rounded-md shadow-sm">
                <div className="flex items-center space-x-4">
                  <Image src={option.logo} alt={option.source} width={50} height={50} className="rounded-md" />
                  <div>
                    <a href={option.link} className="text-blue-600 hover:underline text-lg font-semibold">
                      {option.source}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-lg font-bold">{option.rate_per_night?.lowest || "N/A"}</p>
                  <a href={option.link} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Visit Site</a>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* About Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">About</h2>
          <p className="text-blue-600 text-xl font-bold mt-2">{hotel.overall_rating} ratings</p>
          <p className="text-gray-600">{hotel.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-6">
            {/* Property Amenities */}
            <div>
              <h3 className="text-lg font-semibold">Property Amenities</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Paid public parking nearby</li>
                <li>Free High-Speed Internet (WiFi)</li>
                <li>Kids stay free</li>
                <li>Business Center with Internet Access</li>
                <li>Meeting rooms</li>
                <li>Baggage storage</li>
                <li>Non-smoking hotel</li>
                <li>24-hour check-in</li>
              </ul>
            </div>
            {/* Room Features */}
            <div>
              <h3 className="text-lg font-semibold">Room Features</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Air conditioning</li>
                <li>Housekeeping</li>
                <li>Coffee / tea maker</li>
                <li>Flatscreen TV</li>
                <li>Desk</li>
                <li>Seating area</li>
                <li>Kitchenette</li>
                <li>Walk-in shower</li>
              </ul>
            </div>
          </div>
        </div>

        {hotel.nearby_places && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Nearby Places</h2>
            {hotel.nearby_places.slice(0, 4).map((place, index) => (
              <div key={index} className="mt-4 flex items-center space-x-4 border p-4 rounded-md shadow-sm">
                <Image src={place.thumbnail} alt={place.name} width={50} height={50} className="rounded-md" />
                <div>
                  <a href={place.link} className="text-blue-600 hover:underline text-lg font-semibold">
                    {place.name}
                  </a>
                  <p className="text-gray-700">{place.description}</p>
                  <p className="text-gray-500">⭐ {place.rating} ({place.reviews} reviews)</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <p className="text-blue-600 text-xl font-bold mt-2">{hotel.overall_rating} Ratings</p>
          <p className="text-gray-600">{hotel.reviews} reviews</p>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Rating Breakdown</h3>
              <ul className="list-disc list-inside text-gray-600">
                {hotel.ratings?.map((rating, index) => (
                  <li key={index}>{rating.stars} Stars: {rating.count} reviews</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Review Breakdown</h3>
              <ul className="list-disc list-inside text-gray-600">
                {hotel.reviews_breakdown?.slice(0, 5).map((review, index) => (
                  <li key={index}>{review.name}: {review.positive} positive, {review.negative} negative</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Location Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Location</h2>
          <div className="mt-4 h-auto bg-gray-100 rounded-lg">
            <GoogleMap gps_coordinates={{
              latitude: hotel.gps_coordinates?.latitude || 0,
              longitude: hotel.gps_coordinates?.longitude || 0
            }} />

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HotelCard;