"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import { amenityIcons } from "@/app/constants/AmenityIcons";
import axios from "axios";

interface ListingHeadProps {
  title: string;
  id: string;
  type: string;
  currentUser?: SafeUser | null;
  amenities: string[];
  setFirstImage: (image: string | null) => void; 
}

const ListingHead: React.FC<ListingHeadProps> = ({ id, title, type, amenities,  setFirstImage}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getImages = async () => {
      try {
        console.log("Fetching images...", title);
        
        await new Promise((res) => setTimeout(res, 2000)); // Simulated delay
        console.log("ReQUQUQuq")
        const response = await axios.post("/api/imageshotel", { title });
        const images = response.data || response;
          console.log("HERE")
        if (!images || images.length === 0) {
          console.log("No hotels found");
          return;
        }
        console.log("FETCHED", images);
        setImages(images);
        setFirstImage(images[0]);
       
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    getImages();
  }, [title,setFirstImage]);

  // Function to handle dot click
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Heading Section */}
      <Heading title={title} type={type} />

      {/* Image Carousel */}
      <div className="w-[50vw] h-[60vh] ml-44 flex flex-col items-center justify-center relative">
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
              {images.map((_, index) => (
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

      {/* Amenities Section */}
      <div className="relative bg-white shadow-lg rounded-2xl left-0 p-4 w-[80vw] border border-gray-200 mt-10 mx-auto">
  <p className="font-medium text-xl mb-3">Property Amenities</p>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {amenities.map((amenity) => (
      <div key={amenity} className="flex items-center gap-2 text-neutral-600 whitespace-normal break-words">
        {amenityIcons[amenity] || <span>🔹</span>}
        <span className="leading-5">{amenity}</span>
      </div>
    ))}
  </div>
</div>
    </>
  );
};

export default ListingHead;
