'use client'
import { useTrip } from "@/context/Tripscontext";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Tripsdata from "./Tripsdata";



const Trips = () => {
  const { trip } = useTrip();
  


  useEffect(() => {

    
      const fetchTripData = async () => {
        try {
          const res = await axios.post('/api/mytrips', {
            
            estimatedCost: trip.estimatedCost,
            originText: trip.originText,
            destinationText: trip.destinationText,
            route: trip.route,
            distanceInKm: trip.distanceInKm,
            duration: trip.duration,
            directionsResult: trip.directionsResult,
          });

         
        } catch (error) {
          toast.error("Error fetching trip data")
          console.error("Error fetching trip data:", error);
        }
      };

      fetchTripData();
   

    if (!trip || !trip.route || !trip.directionsResult) {
      console.log("No trip data available.");
      return;
    }

 
  },[trip]);

  return (
<><Tripsdata/></>
   
  );
}


export default Trips;
