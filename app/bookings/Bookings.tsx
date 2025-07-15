'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
const Bookings = () => {
    const [hotels, sethotels] = useState<any>([])
    const [loading, setloading] = useState(false)
    useEffect(() => {
        setloading(true)
        async function req(){
        const res:any = await  axios.get('/api/getuserbookings')
      
        sethotels(res.data)
        setloading(false)
        }
        req()
    }, [])
    if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-2xl font-semibold text-gray-800">Getting your trips...</p>
          </div>
        );
      }
    if (hotels.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-3/4 max-w-lg text-center">
              <Home className="w-16 h-16 text-gray-500 mx-auto" />
              <h2 className="text-2xl font-semibold mt-4">No Current Bookings</h2>
            </div>
          </div>
        );
      }
     
  return (
    <div>
        <div className="flex flex-col space-y-4 p-4">
    {hotels.map((hotel:any, index:any) => (
     <div className="bg-white shadow-lg rounded-2xl p-4 w-3/4 max-w-3xl mx-auto flex items-center space-x-4"
     key={index}>
      <img
        src={hotel.Image || "https://via.placeholder.com/150"}
        alt={hotel.title}
        className="w-80 h-40 object-cover rounded-xl"
      />
      <div>
        <h2 className="text-xl font-semibold mb-6">{hotel.title}</h2>
        <p className="text-black">Price: ${hotel.totalPrice}</p>
        <p className="text-black">Check-in: {new Date(hotel.startDate).toLocaleDateString()}</p>
        <p className="text-black">Check-out: {new Date(hotel.endDate).toLocaleDateString()}</p>
      </div>
    </div>
    ))}
    </div>
    </div>
  );
}

export default Bookings;
