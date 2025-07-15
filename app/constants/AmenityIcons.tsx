// src/utils/amenityIcons.tsx

import { Wifi, ParkingCircle, Wind, Baby, PawPrint, WashingMachine, Waves, Bed, Coffee, Plane, Briefcase, Hotel, Umbrella, ThumbsUp, Info, Smartphone } from "lucide-react";
import { JSX } from "react";

// Define and export the amenity to icon mapping
export const amenityIcons: { [key: string]: JSX.Element } = {
  "Free breakfast": <Coffee size={20} />,
  "Free Wi-Fi": <Wifi size={20} />,
  "Free parking": <ParkingCircle size={20} />,
  "Outdoor pool": <Waves size={20} />,
  "Air conditioning": <Wind size={20} />,
  "Pet-friendly": <PawPrint size={20} />,
  "Spa": <Bed size={20} />, // You can change this icon based on your preference
  "Beach access": <Waves size={20} />,
 
  "Restaurant": <Coffee size={20} />,
  "Room service": <Bed size={20} />,
  "Airport shuttle": <Plane size={20} />,
  "Full-service laundry": <WashingMachine size={20} />,
  "Accessible": <ParkingCircle size={20} />,
  "Business centre": <Briefcase size={20} />,
 
  "Child-friendly": <ThumbsUp size={20} />,
  
  "Bar": <Umbrella size={20} />, // Used for a bar/lounge type
};
