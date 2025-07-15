"use client";


import { SafeUser } from "@/app/types";
import { Category } from "@/app/types/categories";
import { Users, Bed, Bath, Home } from "lucide-react";


import GoogleMap from "../GoogleMaps";
import dynamic from "next/dynamic";

interface ListingInfoProps {
  user: SafeUser | null;

  description: string;
  roomCount: number;
 
  beds: number;
  bathroomCount: number;
  
  gps_coordinates:{latitude:number,longitude:number}

}
const GoogleMapNoSSR = dynamic(() => import("../GoogleMaps"), { ssr: false });
const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  gps_coordinates,
  description,
  roomCount,
 
  bathroomCount,
  beds,
  

}) => {
  



  return (
    <div className="flex flex-col col-span-4 gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 text-xl font-semibold">


        </div>
        <div className="flex flex-row items-center gap-4 font-medium text-neutral-800">
       
          <div className="flex items-center gap-2">
            <Home size={20} /> <span>{roomCount} rooms</span>
          </div><p>|</p>
          <div className="flex items-center gap-2">
            <Bath size={20} /> <span>{bathroomCount} Bathrooms</span>
          </div><p>|</p>
          <div className="flex items-center gap-2">
            <Bed size={20} /> <span>{beds} Beds</span>
          </div>

        </div>
      </div>

      <div className="text-lg font-medium text-neutral-800">{description}</div>

      <hr />
      <div className="flex flex-row items-center gap-2 ">
      <GoogleMapNoSSR gps_coordinates={gps_coordinates}/>
        
      </div>
      

    </div>
  );
};

export default ListingInfo;
