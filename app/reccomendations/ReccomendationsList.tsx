'use client'

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ReccomendationsList = ({ titles }: { titles: string[] }) => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [isData, setIsData] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0]; 
  useEffect(() => {
    const makeRequests = async () => {
      const hotelResults: any[] = [];

      for (const title of titles) {
        if (hotelResults.length >= 5) break; // Stop if we already have 5 results.

        try {
          const response = await axios.post('/api/searchhotelsforpy', { title });
          const hotels = response.data?.ads || response.data?.data || [];
          console.log("Hotels:", hotels)

          // Filter out undefined, null, or empty hotel results
          
          
          // Add filtered results from each title search to the hotelResults array
          hotelResults.push(...hotels);

          // Stop if we have 5 or more results
          if (hotelResults.length >= 5) break;
        } catch (error) {
          console.error('Error fetching data for title:', title, error);
        }
      }
      console.log("Hotel Results:", hotelResults)

      // Limit results to exactly 5 hotels
      setHotels(hotelResults.slice(0, 5));
      setIsData(true);
    };

    makeRequests();
  }, [titles]);

  if (!isData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Hotels Based on Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.slice(0, 5).map((hotel: any, index: any) => (
          <div
            key={index}
            className="border rounded-lg shadow-lg p-4 flex flex-col bg-white hover:shadow-xl transition duration-300"
          >
            {/* Hotel Image */}
            <img
              src={hotel?.thumbnail || hotel?.image || hotel?.images[0].thumbnail|| hotel.data?.thumbnail || hotel?.images?.[0]?.thumbnail || "/default_image.jpg"} 
              alt={hotel.title || hotel.name}
              className="w-full h-48 object-cover rounded-md"
          
            />

            {/* Hotel Details */}
            <div className="flex flex-col justify-between flex-1 p-3">
              <p className='text-black font-semibold transition duration-200'>{hotel.title || hotel.name}</p>
             <hr/>
             

              {/* Hotel Location & Source */}
              <p className="text-sm text-gray-500 mt-2">
                Source: <span className="font-medium text-blue-600">
                  <a
                    href={hotel.tracking_link || hotel.link || hotel.data?.tracking_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-semibold transition duration-200"
                  >
                    {hotel.source || hotel.data?.source || "serpapi"}
                  </a>
                </span>
              </p>

              <p className="text-black-500 font-bold text-sm mt-2">Ratings:⭐ {hotel.rating || hotel.overall_rating || hotel.data?.rating || "No Rating"} | Reviews:({ hotel.reviews || "256"})</p>

              {/* Price & Button */}
              <div className="flex items-center justify-between mt-3">
                <p className="text-black font-bold text-lg">{hotel.price  || hotel.data?.price || "$99"} / night</p>

                <Link
                  href={`/hotels/${encodeURIComponent(hotel?.title || hotel?.name || hotel.name)}?checkInDate=${currentDate}&checkOutDate=${currentDate}`}
                  className="bg-black text-white hover:bg-grey-700 px-4 py-2 rounded-lg shadow-md transition duration-300"
                >
                  View Deal
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReccomendationsList;
