'use client'

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

interface NearbyProps {
  hotels: any[];
}

const Nearby: React.FC<NearbyProps> = ({ hotels }) => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const currentDate = new Date().toISOString().split('T')[0]; 

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateRange({ startDate: today, endDate: today });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div className=" h-auto w-auto p-6">
      {hotels.length > 0 && (
        <h1 className="text-3xl font-bold mb-6 text-center">Nearby Hotels</h1>
      )}
      {hotels.length === 0 ? (
        <h1 className="text-2xl font-bold mb-4"></h1>
      ) : (
        <Slider {...settings} className="gap-0">
          {hotels.map((hotel: any, index: number) => (
            <div className="flex justify-center" key={index}>
              <div className="border rounded-2xl shadow-md shadow-gray-300 p-2 max-w-xs h-[380px] bg-white flex flex-col justify-between mx-0.5">
                <img
                  src={hotel.thumbnail}
                  alt={hotel.title}
                  className="w-full h-36 object-cover rounded-xl"
                />
                <h2 className="text-lg font-bold mt-2">{hotel.title}</h2>
                <p className="text-gray-600">⭐ {hotel.rating} ({hotel.reviews} reviews)</p>
                <p className="text-sm text-gray-500">{hotel.address}</p>
                {hotel.phone && <p className="text-sm text-gray-700">📞 {hotel.phone}</p>}
                <Link
                  href={`/hotels/${encodeURIComponent(hotel?.title || hotel.data.title || hotel?.name)}?checkInDate=${currentDate}&checkOutDate=${currentDate}`}
                  className="bg-black text-white hover:bg-grey-700 px-4 py-2 rounded-lg shadow-md transition duration-300"
                >
                  View Deal
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default Nearby;
