
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HotelImageProps {
  title: string;
}

const HotelImage: React.FC<HotelImageProps> = ({ title }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const getImages = async () => {
      try {
        
        console.log("Fetching images...", title);

        await new Promise((res) => setTimeout(res, 2000)); // Simulated delay

        const response = await axios.post("http://localhost:5000/api/hotels", { title });
        const hotels = response.data || response;
        console.log("HOTELS DATA",hotels)

        if (!hotels || hotels.length === 0) {
          console.log("No hotels found");
          return;
        }

        const fetchedImages = hotels.photos

        console.log("FETCHED", fetchedImages);

        if (isMounted) {
          setImages(fetchedImages);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    getImages();

    return () => {
      isMounted = false;
    }; // Cleanup to prevent state update after unmount
  }, [title]);

  // Function to handle dot click
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {images.length > 0 ? (
        <>
          {/* Main Image */}
          <div className="h-[31vh] w-full shadow-md transition-transform duration-200">
            <Image
              className="w-full h-full object-contain rounded-lg"
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
  );
};

export default HotelImage;
