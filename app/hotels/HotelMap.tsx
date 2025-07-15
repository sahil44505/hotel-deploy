"use client";

import { useEffect, useRef, useState } from "react";

interface HotelMapProps {
  hotelData: { name: string; price: string }[];
}

export default function HotelMap({ hotelData }: HotelMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [hotels, setHotels] = useState<
    { name: string; price: string; latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    if (!hotelData || hotelData.length === 0) return;

    // Prevent multiple script loads
    if (!window.google?.maps) {
      if (!document.querySelector('script[src*="gomaps.pro"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.gomaps.pro/maps/api/js?key=${process.env.NEXT_PUBLIC_GOMAPS_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => fetchAndSetHotels();
        document.head.appendChild(script);
      }
    } else {
      fetchAndSetHotels();
    }
  }, [hotelData]); // ✅ Only run once

  const fetchAndSetHotels = async () => {
    setTimeout(async () => {
      const results = await Promise.all(
        hotelData.map((hotel) => fetchHotelLocation(hotel.name, hotel.price))
      );

      const validResults = results.filter((hotel) => hotel !== null) as {
        name: string;
        price: string;
        latitude: number;
        longitude: number;
      }[];

      setHotels(validResults);
    }, 1000);
  };

  useEffect(() => {
    if (!mapRef.current || hotels.length === 0) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: hotels[0].latitude, lng: hotels[0].longitude },
      zoom: 14,
    });

    hotels.forEach((hotel) => {
      const marker = new google.maps.Marker({
        position: { lat: hotel.latitude, lng: hotel.longitude },
        map,
        icon: {
          url: createCustomMarker(hotel.price),
          scaledSize: new google.maps.Size(120, 50),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-size:14px;font-weight:bold;color:#333;">${hotel.name} - ${hotel.price}</div>`,
      });

      marker.addListener("mouseover", () => infoWindow.open(map, marker));
      marker.addListener("mouseout", () => infoWindow.close());
    });
  }, [hotels]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
}

// Fetch hotel location using GoMaps.pro API
const fetchHotelLocation = async (hotelName: string, price: string) => {
  try {
    const response = await fetch(
      `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(
        hotelName
      )}&key=${process.env.NEXT_PUBLIC_GOMAPS_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      return {
        name: hotelName,
        price,
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
      };
    }
  } catch (error) {
    console.error("Error fetching hotel location:", error);
  }
  return null;
};

// Create a custom marker with price
const createCustomMarker = (price: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#c1c8ce";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(10, 5, 100, 40, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`$` + price, 60, 30);

  return canvas.toDataURL();
};
