'use client'

import { SafeUser } from "@/app/types";
import { createContext, ReactNode, RefObject, useContext, useRef, useState } from "react";


interface Trips{
    directionsResult: any | null;
    estimatedCost : number | null;
    originText: string | any;
    destinationText : string | any;

    route : google.maps.DirectionsLeg | any;
    duration: any | null;
    distanceInKm:any | null
}
interface TripContextType{
    trip:Trips;
    setTrip:(trips:Trips)=>void;
}
const Tripscontext = createContext<TripContextType | undefined>(undefined);

export const TripProvider:React.FC<{children: ReactNode}> = ({children}) =>{
    const [trip, setTrip] = useState<Trips>({ 
        directionsResult:null,
        estimatedCost:0 , 
        originText:'' ,
        destinationText:'' ,
       
        
        route : {} as google.maps.DirectionsLeg ,
        distanceInKm:'',
         duration:'',
});
    return (
        <Tripscontext.Provider value={{ trip, setTrip }}>
          {children}
        </Tripscontext.Provider>
      );
}

export const useTrip = () =>{
    const context = useContext(Tripscontext)
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
      }
      return context;
}
