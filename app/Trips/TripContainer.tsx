'use client'
import { useTrip } from "@/context/Tripscontext";

import Tripsdata from "./Tripsdata";
import Trips from "./Trips";


const TripContainer = () => {
    
    const { trip } = useTrip();
  if (
    trip.directionsResult === null ||
    trip.estimatedCost === 0 ||
    trip.originText === "" ||
    trip.destinationText === "" ||


    Object.keys(trip.route).length === 0 ||
    trip.distanceInKm === "" ||
    trip.duration === "" ||
    Object.keys(trip).length === 0) {
    return (
      <Tripsdata/>
      
    );
  }
  return (
    <div>
      <Trips/>
    </div>
  );
}

export default TripContainer;
