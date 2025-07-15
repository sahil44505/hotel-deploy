'use client'

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaCarSide } from "react-icons/fa";

const Tripsdata = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Use an array of refs for each map container
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        console.log("Fetching trips data...");
        const res = await axios.get('/api/gettrips');
        console.log("Trips data:", res.data.trips);
        setTrips(res.data.trips); 
      
       
      } catch (err) {
        setError(true);
        
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window !== "undefined" && !window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.gomaps.pro/maps/api/js?key=${process.env.NEXT_PUBLIC_GOMAPS_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMaps();
        document.head.appendChild(script);
      } else {
        initMaps();
      }
    };

    const initMaps = () => {
      trips.forEach((trip, index) => {
        const mapContainer = mapRefs.current[index];
        if (!mapContainer) return;
        const map = new google.maps.Map(mapContainer, {
          center: { lat: trip.route.start_location.lat, lng: trip.route.start_location.lng },
          zoom: 13,
        });
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(trip.directionsResult);

        // Create marker for start location
        new google.maps.Marker({
          position: { lat: trip.route.start_location.lat, lng: trip.route.start_location.lng },
          map,
          title: "Start Location",
        });
        // Create marker for destination
        new google.maps.Marker({
          position: { lat: trip.route.end_location.lat, lng: trip.route.end_location.lng },
          map,
          title: "Destination",
        });
      });
    };

    if (trips.length > 0) {
      loadGoogleMapsScript();
    }
  }, [trips]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-gray-800">Getting your trips...</p>
      </div>
    );
  }

  // If there's an error or no trips available, display the "No trips found" card
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden p-6 border border-gray-200 flex flex-col items-center">
          <FaCarSide size={100} />
          <h2 className="text-3xl font-semibold mt-4 text-gray-800">No trips found</h2>
          <p className="text-gray-500 mt-2">Book a ride to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 flex flex-col items-center space-y-6">
      {trips.map((trip, index) => (
        <div
          key={index}
          className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden p-6 md:p-8 flex flex-row items-center border border-gray-200"
        >
          {/* Map Section */}
          <div className="w-1/3 h-[290px] rounded-lg overflow-hidden shadow-md bg-gray-200">
            <div ref={(el) => { mapRefs.current[index] = el; }} className="h-full w-full" />
          </div>

          {/* Trip Details */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold pl-6 text-gray-800">Your Trip Details</h2>
            <div className="bg-gray-100 p-5 rounded-xl shadow-sm space-y-2">
              <p className="text-gray-700"><strong>From:</strong> {trip.originText}</p>
              <p className="text-gray-700"><strong>To:</strong> {trip.destinationText}</p>
              <p className="text-gray-700"><strong>Distance:</strong> {trip.distanceInKm} km</p>
              <p className="text-gray-700"><strong>Duration:</strong> {trip.duration.text}</p>
              <p className="text-blue-600 font-semibold"><strong>Cost:</strong> ${trip.estimatedCost}</p>
              <p className="text-green-600 font-semibold">✅ Paid</p>
              <div className="bg-gray-200 p-3 rounded-lg mt-3">
                <p className="text-md font-semibold text-gray-900">Driver: Joe</p>
                <p className="text-gray-600 text-sm">📞 9820934567</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tripsdata;
