"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MapPin } from "lucide-react";


const SearchHero = ({ isNavbarMode = false ,setNearby}: { isNavbarMode?: boolean ,setNearby: (data: any[]) => void;}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showHeroSearch, setShowHeroSearch] = useState(true);

  // Hide only the hero search bar when scrolling past 10px
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          setError("Failed to get location. Please enable GPS and try again.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);
 
  useEffect(() => {
    const handleScroll = () => {
      if (!isNavbarMode) {
        setShowHeroSearch(window.scrollY <= 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNavbarMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {

    try {
      
      router.push(`/hotels?query=${query}`);
    } catch (err) {
      console.log(err);
    }
   
    
  };
  async function handleNearby(){
    if(location){
      const res:any = await axios.post('/api/getnearby',{location})
      const data =  res.data
      setNearby(data)
      
    }
    
    setIsOpen(false)
  }

   
 
  // Hide the hero search bar when scrolled past 10px, but keep navbar search
  if (!showHeroSearch && !isNavbarMode) return null;

  return (
    <div
      ref={dropdownRef}
      className={`${
        isNavbarMode
          ? "w-[342px] bg-white absolute top-[55%] left-[36%] transform -translate-x-1/2 -translate-y-1/2"
          : "w-[60vw] font-normal absolute top-[278px] left-[50%] transform -translate-x-1/2"
      }`}
    >
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full flex items-center bg-white rounded-full px-3 py-2 border border-gray-400 focus-within:ring-0 text-black"
      >
        <Search className="w-5 h-5 text-black" />
        <input
          type="text"
          placeholder="Search for hotels and places..."
          className={`w-full ml-2 text-base outline-none bg-transparent ${
            isNavbarMode ? "text-sm p-1" : "font-medium"
          }`}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-3 py-1 rounded-full font-medium text-base"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Search"}
        </button>
      </div>

      {/* Show dropdown only in hero mode */}
      {isOpen && !isNavbarMode && (
        <div className="absolute flex top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 p-4 font-medium z-50">
          <MapPin className="w-5 h-5 mt-2 text-black" />
          <button

            className="block text-left w-full text-black py-2 hover:bg-gray-200 px-2 rounded font-medium"
            onClick={handleNearby}
          >
            Nearby Hotels
            
          </button>
          
        </div>
      )}
    </div>
  );
};

export default SearchHero;
