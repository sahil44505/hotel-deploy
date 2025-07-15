'use client'
import { useEffect, useRef, useState } from "react";
import Payment from "./Payment";
import { useRouter } from "next/navigation";
import { useTrip } from "@/context/Tripscontext";

import axios from "axios";

interface GooglemapsProps {
  gps_coordinates: { latitude: number; longitude: number };
}

const GoogleMap: React.FC<GooglemapsProps> = ({ gps_coordinates }) => {
 
  
  const [mounted, setMounted] = useState(false);
 

  // Refs for DOM elements and Google Maps objects
  const mapRef = useRef<HTMLDivElement>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);


  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // State for the map (only declared once)
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [route, setRoute] = useState<google.maps.DirectionsLeg | null>(null);
  const [distanceInKm, setDistanceInKm] = useState<number>(0);
  const [duration,setduration] = useState<any>('')
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);


  // Controlled input states
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const {setTrip} = useTrip()
 

  
  

  // Load Google Maps script and initialize map and services
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window !== "undefined" && !window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyp9iLu3A3aeF-vbR2usZdVLwiEv6NhtN9i&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
 
  

      if (!mapRef.current || !window.google) return;

      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: gps_coordinates.latitude, lng: gps_coordinates.longitude },
        zoom: 13,
      });
      setMap(newMap);
      
      
     

      if (originInputRef.current) {
        originAutocompleteRef.current = new google.maps.places.Autocomplete(originInputRef.current);
      }
      if (destinationInputRef.current) {
        destinationAutocompleteRef.current = new google.maps.places.Autocomplete(destinationInputRef.current);
      }

      // Initialize directions service and renderer
      directionsServiceRef.current = new google.maps.DirectionsService();
      const renderer = new google.maps.DirectionsRenderer();
      renderer.setMap(newMap);
      directionsRendererRef.current = renderer;

      // Initialize geocoder
      geocoderRef.current = new google.maps.Geocoder();

      // Reverse geocode the provided GPS coordinates to set default destination
      if (destinationInputRef.current && geocoderRef.current) {
        geocoderRef.current.geocode(
          { location: { lat: gps_coordinates.latitude, lng: gps_coordinates.longitude } },
          (results: any, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
              destinationInputRef.current!.value = results[0].formatted_address;
              setDestinationText(results[0].formatted_address);
            }
          }
        );
      }

      // Get user's current location for the origin marker
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            newMap.setCenter(userLocation);
            if (originInputRef.current && geocoderRef.current) {
              geocoderRef.current.geocode({ location: userLocation }, (results: any, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                  originInputRef.current!.value = results[0].formatted_address;
                  setOriginText(results[0].formatted_address);
                }
              });
            }
            // Place a marker at the user's location
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }
            markerRef.current = new google.maps.Marker({
              position: userLocation,
              map: newMap,
              title: "Current Location",
            });
          },
          () => {
            console.log("Geolocation failed.");
          }
        );
      } else {
        console.log("Browser doesn't support Geolocation.");
      }

      // Allow user to click on the map to set a new origin marker
      newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng && originInputRef.current && geocoderRef.current) {
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          markerRef.current = new google.maps.Marker({
            position: event.latLng,
            map: newMap,
            title: "Selected Location",
          });
          // Update the origin input with the address of the clicked location
          geocoderRef.current.geocode({ location: event.latLng }, (results: any, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
              originInputRef.current!.value = results[0].formatted_address;
              setOriginText(results[0].formatted_address);
            }
          });
        }
      });
    };

    loadGoogleMapsScript();

  }, [gps_coordinates]);

  const router = useRouter()
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className="p-6">Loading...</div>;
  }

  // Handler for calculating the route
  const handleCalculateRoute = () => {
    if (
      !directionsServiceRef.current ||
      !directionsRendererRef.current ||
      !originInputRef.current ||
      !destinationInputRef.current
    ) {
      console.log("Map not initialized properly");
      return;
    }
    setIsLoading(true);

    let originPlace = originAutocompleteRef.current?.getPlace();
    let destinationPlace = destinationAutocompleteRef.current?.getPlace();

    const attemptRoute = (
      originPlace: google.maps.places.PlaceResult,
      destinationPlace: google.maps.places.PlaceResult
    ) => {
      if (!originPlace.geometry || !destinationPlace.geometry) {
        console.log("Missing geometry in place results");
        setIsLoading(false);
        return;
      }
      directionsServiceRef.current!.route(
        {
          origin: originPlace.geometry.location!,
          destination: destinationPlace.geometry.location!,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          setIsLoading(false);
          if (status === google.maps.DirectionsStatus.OK && response) {
            directionsRendererRef.current!.setDirections(response);
            const route = response.routes[0].legs[0];
            const distanceInKm = route.distance?.value ? route.distance.value / 1000 : 0;
            
            const cost = distanceInKm * 1; 
           
            const dur = route.duration
            setduration(dur)
            setRoute(route);
            setDistanceInKm(distanceInKm);
            setEstimatedCost(cost);
            setDirectionsResult(response);
          } else {
            console.log("Route calculation failed: " + status);
          }
        }
      );
      
    };

    // Fallback: If autocomplete doesn't return valid geometry, use geocoding with controlled input values.
    if (!originPlace || !originPlace.geometry) {
      if (originText.trim() !== "" && geocoderRef.current) {
        geocoderRef.current.geocode({ address: originText }, (results: any, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0] &&
            results[0].geometry
          ) {
            originPlace = results[0];
            if (!destinationPlace || !destinationPlace.geometry) {
              if (destinationText.trim() !== "" && geocoderRef.current) {
                geocoderRef.current.geocode({ address: destinationText }, (results: any, status) => {
                  if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0] &&
                    results[0].geometry
                  ) {
                    destinationPlace = results[0];
                    attemptRoute(originPlace!, destinationPlace!);
                  } else {
                    setIsLoading(false);
                    console.log("Destination geocoding failed.");
                  }
                });
              } else {
                setIsLoading(false);
                console.log("Destination not selected.");
              }
            } else {
              attemptRoute(originPlace!, destinationPlace);
            }
          } else {
            setIsLoading(false);
            console.log("Origin geocoding failed. User typed:", originText);
          }
        });
        return;
      } else {
        setIsLoading(false);
        console.log("Origin not selected.");
        return;
      }
    }

    if (!destinationPlace || !destinationPlace.geometry) {
      if (destinationText.trim() !== "" && geocoderRef.current) {
        geocoderRef.current.geocode({ address: destinationText }, (results: any, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0] &&
            results[0].geometry
          ) {
            destinationPlace = results[0];
            attemptRoute(originPlace!, destinationPlace!);
          } else {
            setIsLoading(false);
            console.log("Destination geocoding failed.");
          }
        });
        return;
      } else {
        setIsLoading(false);
        console.log("Destination not selected.");
        return;
      }
    }
    attemptRoute(originPlace, destinationPlace);
  };

  // Handler for resetting the map
  const handleResetMap = () => {
    if (!map || !directionsRendererRef.current) return;
    // Clear directions
    directionsRendererRef.current.setDirections({
      geocoded_waypoints: [],
      routes: [],
      request: {} as google.maps.DirectionsRequest,
    });
    setEstimatedCost(null);
    const centerCoords = { lat: gps_coordinates.latitude, lng: gps_coordinates.longitude };
    map.setCenter(centerCoords);
    map.setZoom(13);
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    markerRef.current = new google.maps.Marker({
      position: centerCoords,
      map: map,
      title: "Default Location",
    });
  };
  async function  onSubmit(){
      
    
    setTrip({
      estimatedCost: estimatedCost,
      originText: originText,
      destinationText: destinationText,
     
      route:route,
      distanceInKm,
      duration,
      directionsResult

    })
    router.push('/Trips')
    
    
  }
  
  const Estimatedcost = estimatedCost !== null ? Math.trunc(estimatedCost) : 0;
 

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <p className="m-2 font-medium">Taxi Booking</p>
      {/* Input Section */}
      <div className="mb-4 space-y-4 gap-2">
        <input
          ref={originInputRef}
          id="origin-input"
          type="text"
          placeholder="Enter origin"
          value={originText}
          onChange={(e) => setOriginText(e.target.value)}
          className="mt-2 w-[500px] p-3 text-base border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          ref={destinationInputRef}
          id="destination-input"
          type="text"
          placeholder="Enter destination"
          value={destinationText}
          onChange={(e) => setDestinationText(e.target.value)}
          className="mt-2 w-[500px] p-3 text-base border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          id="go-button"
          onClick={handleCalculateRoute}
          className={`w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Calculating..." : "Calculate"}
        </button>
        <button
          onClick={handleResetMap}
          className="m-3 w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Reset Map
        </button>
      </div>
      {/* Map Container */}
      <div ref={mapRef} id="map" className="h-[400px] w-full rounded-lg shadow-lg mb-4 relative"></div>
      {/* Estimated Cost & Pay Now (shown if route is calculated) */}
      {estimatedCost !== null && (
        <div id="info" className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-md mt-2.5 text-sm">
          <span className="text-lg font-semibold">
            Estimated Cost: ${estimatedCost.toFixed(2)}
          </span>
          
          <Payment onSubmit={onSubmit} estimatedCost={Estimatedcost}/>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
