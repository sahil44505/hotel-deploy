'use client';
import { useHotel } from "@/context/Hotelscontext";
import HotelMap from "./HotelMap";
import { useEffect, useState } from "react";
import { Range } from "react-date-range";
import Link from "next/link";
import DateRangePicker from "@/app/components/DateRangePicker"


import axios from "axios";
interface HotellistingProps {
  title: string

}

const HotelListing: React.FC<HotellistingProps> = ({ title }) => {
  const [showAll, setShowAll] = useState(false);
 
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [hotels, sethotels] = useState<any[]>([])
  const [datehotel, setdatehotel] = useState<any[]>([])
  const [priceRange, setPriceRange] = useState(270);
  const [isdata,setisdata] = useState(false)
  const [hasHotels, setHasHotels] = useState(true)
 

  interface DateRange {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  useEffect(() => {
    async function gethotelsindate() {
      
      
      sethotels([]);
  
      const res = await axios.post('/api/hotelsindate', {
        title,
        checkIn: dateRange.startDate,
        checkOut:dateRange.endDate
      });
  
      const data = res.data;
      console.log("Hotels for selected date:", data);
      setdatehotel(data);
    }
  
    gethotelsindate();
  }, [dateRange]); 


  useEffect(() => {
    
    console.log(title, "IS TITLE")
    async function makerequest() {
      
      const response = await axios.post("/api/searchHotels", { title });
      const hotels = response.data?.ads || response.data.data;
      if(response.data.data){
        setisdata(true)
      }
      
      
      sethotels(hotels)

      console.log("Extracted Hotels:", hotels);

    }
    if (hotels.length > 0) {
      setDateRange({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      });
    }
    makerequest()
  }, [title])
  
 

  const [selectedFilters, setSelectedFilters] = useState({
    popular: {
      fiveStar: false,
      breakfast: false,
    },
    amenities: {} as Record<string, boolean>,
    hotelClass: {
      fiveStar: false,
      fourStar: false,
      threeStar: false,
      twoStar: false,
    },
    priceRange: { min: 0, max: 270 },
  });

  const handleFilterChange = (category: string, key: string, value: boolean) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };
  const handleDateChange = (range: Range) => {
    setDateRange({
      startDate: range.startDate || new Date(),
      endDate: range.endDate || new Date(),
      key: range.key || "selection",
    });
  };
  
 

 
  
  const amenitiesList = [
    "Free Parking",
    "Parking",
    "Indoor Pool",
    "Outdoor Pool",
    "Pool",
    "Fitness Center",
    "Restaurant",
    "Free Breakfast",
    "Spa",
    "Beach Access",
    "Child-friendly",
    "Bar",
    "Pet-friendly",
    "Room Service",
    "Free Wi-Fi",
    "Air-conditioned",
  ];

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(event.target.value)); // ✅ Update price state dynamically
  };
 
  const visibleAmenities = showAll ? amenitiesList : amenitiesList.slice(0, 5);
function applyFilters(){
 
  const updatedFilters = {
    ...selectedFilters,
    priceRange: { min: 0, max: priceRange },
  };
  setSelectedFilters(updatedFilters);
  
  console.log("Updated Filters:", updatedFilters);
  const selectedAmenities = updatedFilters?.amenities;
 
  const amenity = extractAmenityNumbers(selectedAmenities)
  const selectedHotelClass = updatedFilters?.hotelClass
  const hotel_class= extractHotelClassNumbers(selectedHotelClass)
  const price =extractPriceRange(updatedFilters)
  async function makereqtofilter() {
    try {
      setIsFilterLoading(true);
     
      const res: any = await axios.post("/api/filters", {
        title,
        checkIn: dateRange.startDate,
        checkOut: dateRange.endDate,
        amenity,
        price,
        hotel_class,
      });
      const data = res.data;
      
      sethotels([])
      setdatehotel(data);  // Update hotels with filtered results
    } catch (error) {
      console.error("Error applying filters:", error);
    }finally{
      setIsFilterLoading(false);
    }
  }
  makereqtofilter();
}

// Map each amenity to its corresponding number
const amenityMapping: Record<string, number> = {
  "Free parking": 1,
  "Parking": 3,
  "Indoor pool": 4,
  "Outdoor pool": 5,
  "Pool": 6,
  "Fitness center": 7,
  "Restaurant": 8,
  "Free breakfast": 9,
  "Spa": 10,
  "Beach access": 11,
  "Child-friendly": 12,
  "Bar": 15,
  "Pet-friendly": 19,
  "Room service": 22,
  "Free Wi-Fi": 35,
};

// Function to extract the numbers from selected filters
function extractAmenityNumbers(selectedAmenities: Record<string, boolean>): number[] {
  return Object.entries(selectedAmenities)
    .filter(([amenity, isSelected]) => isSelected && amenityMapping[amenity] !== undefined)
    .map(([amenity]) => amenityMapping[amenity]);
}
// Mapping for hotel class filters
const hotelClassMapping: Record<string, number> = {
  "twoStar": 2,
  "threeStar": 3,
  "fourStar": 4,
  "fiveStar": 5,
};
function extractHotelClassNumbers(selectedHotelClass: Record<string, boolean>): number[] {
  return Object.entries(selectedHotelClass)
    .filter(([classKey, isSelected]) => isSelected && hotelClassMapping[classKey] !== undefined)
    .map(([classKey]) => hotelClassMapping[classKey]);
}

function extractPriceRange(filters: { priceRange: { min: number; max: number } }): [number, number] {
  return [filters.priceRange.min, filters.priceRange.max];
}

const hotelData = datehotel.length > 0 
? datehotel.slice(0, 9).map((hotel) => ({ name: hotel.name || hotel.data.title, price: hotel.rate_per_night?.extracted_lowest || hotel?.data?.price || "N/A" }))
: hotels.slice(0, 9).map((hotel) => ({ name: hotel.title || hotel.data.title, price: hotel.price || hotel?.data?.price || "N/A" }));

  return (
    
    <>
      <div className=" border-2 border-grey-500 h-auto">
        <div className="w-full px-10 py-5">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-gray-500 mb-2">
            <span> Best Hotels</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold">{title} and Places to Stay</h1>

          {/* Main Section */}
          <div className="flex flex-wrap mt-4 gap-4">
            {/* Left Section - Map */}
            <div className="relative w-80 h-40 border rounded-md overflow-hidden">
              {/* Replace this with an actual Map component or image */}
              <HotelMap hotelData={hotelData} />

            </div>

            {/* Right Section - Info Boxes */}
            <div className="flex flex-nowrap gap-4 h-[fit-content]">
              <DateRangePicker onDateChange={handleDateChange} />


            </div>
          </div>
        </div>

      </div>

      <div className="flex w-[90vw] mx-auto">
        {/* Left Sidebar - Filters */}
        <div className="w-[25%] p-4 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>

          {/* Price Range */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Price</h3>
            <input 
              type="range" 
              min="0" 
              max="270" 
              value={priceRange} 
              className="w-full accent-black" 
              onChange={handlePriceChange} 
            />
            <p className="text-sm">${priceRange} / night</p> 
            
          </div>

         
          <div className="mb-4">
      <h3 className="font-bold mb-2">Amenities</h3>
      {visibleAmenities.map((amenity, index) => (
        <div key={index}>
          <input type="checkbox" 
          id={amenity.toLowerCase().replace(/\s+/g, "-")} 
          className="mr-2" 
          checked={selectedFilters.amenities[amenity] || false}
          onChange={(e) =>
            handleFilterChange("amenities", amenity, e.target.checked)
          }
          />
          <label htmlFor={amenity.toLowerCase().replace(/\s+/g, "-")}>{amenity}</label>
        </div>
      ))}
      {amenitiesList.length > 5 && (
        <p
          className="text-blue-500 cursor-pointer mt-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show More"}
        </p>
      )}
    </div>

          {/* Hotel Class */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Hotel class</h3>
            <div>
              <input type="checkbox"
               id="fiveStarClass" 
               className="mr-2" 
               checked={selectedFilters.hotelClass.fiveStar}
                onChange={(e) =>
                  handleFilterChange("hotelClass", "fiveStar", e.target.checked)
                }
               />
              <label htmlFor="fiveStarClass">5 Star</label>
            </div>
            <div>
              <input type="checkbox"
               id="fourStar" 
              className="mr-2" 
              checked={selectedFilters.hotelClass.fourStar}
                onChange={(e) =>
                  handleFilterChange("hotelClass", "fourStar", e.target.checked)
                }
              />
              <label htmlFor="fourStar">4 Star</label>
            </div>
            <div>
              <input type="checkbox" id="threeStar" 
              className="mr-2" 
              checked={selectedFilters.hotelClass.threeStar}
              onChange={(e) =>
                handleFilterChange("hotelClass", "threeStar", e.target.checked)
              }
              />
              <label htmlFor="threeStar">3 Star</label>
            </div>
            <div>
              <input type="checkbox" 
              id="twoStar" 
              className="mr-2" 
              checked={selectedFilters.hotelClass.twoStar}
              onChange={(e) =>
                handleFilterChange("hotelClass", "twoStar", e.target.checked)
              }/>
              <label htmlFor="twoStar">2 Star</label>
            </div>
          </div>
          <button 
            onClick={applyFilters} 
            disabled={isFilterLoading}
            className={`w-full py-2 mt-4 rounded-md ${isFilterLoading ? "bg-gray-500" : "bg-black text-white"}`}
>
  {isFilterLoading ? "Updating..." : "Update Filters"}
           
          </button>
        </div>
        

        {/* Right Section - Hotel Listings */}
        <div className="w-[75%] p-4">
          
  {hotels.length > 0 ? (
    // ✅ Show 'hotels' if it has data
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.slice(0, 9).map((hotel: any, index: any) => (
        <div
          key={index}
          className="border rounded-lg shadow-lg p-4 flex flex-col bg-white hover:shadow-xl transition duration-300"
        >
          {/* Hotel Image */}
          <img
  src={hotel?.thumbnail || hotel?.image || hotel?.data?.thumbnail || hotel?.images?.[0]?.thumbnail || "/images/default_image.jpg"} 
  alt={hotel?.title || hotel.data.title || hotel?.name || "Hotel Image"}
  className="w-full h-48 object-cover rounded-md"
  onError={(e) => (e.currentTarget.src = "")} // ✅ Handle broken images
/>


          {/* Hotel Details */}
          <div className="flex flex-col justify-between flex-1 p-3">
            <Link href={`/hotels/${encodeURIComponent(hotel?.title || hotel.data.title || hotel?.name)}?checkInDate=${dateRange.startDate}&checkOutDate=${dateRange.endDate}`}>
              <h2 className="text-xl font-bold text-gray-900 hover:underline">{hotel.title || hotel.data.title}</h2>
            </Link>
            <p className="text-sm text-gray-500">
              Source: <span className="font-medium text-blue-600">
                <a
                  href={hotel?.tracking_link || hotel?.link ||  hotel?.data?.tracking_link || "website"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-semibold transition duration-200"
                >
                  { (hotel.source || (hotel.data && hotel.data.source)) || "serpapi" }
                </a>
              </span>
            </p>
            <p className="text-yellow-500 font-bold text-sm">⭐ {hotel?.rating || hotel?.data?.rating} ({hotel?.reviews || "256"})</p>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-black font-bold text-lg">{hotel?.price || hotel?.data?.price} / night</p>

              <a
                href={`/hotels/${encodeURIComponent(hotel?.title || hotel?.data?.title || hotel?.name)}?checkInDate=${dateRange.startDate}&checkOutDate=${dateRange.endDate}`}
                className=" bg-black text-white hover:bg-grey-700 px-4 py-2 rounded-lg shadow-md transition duration-300"
              >
                View Deal
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : datehotel.length > 0 ? (
    // ✅ Show 'datehotel' if 'hotels' is empty but 'datehotel' has data
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datehotel.slice(0, 9).map((hotel: any, index: any) => (
        <div
          key={index}
          className="border rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
        >
          {/* Hotel Image */}
          <img
  src={hotel?.thumbnail || hotel?.images?.[0]?.thumbnail || "/images/default_image.jpg"} 
  alt={hotel?.title || hotel?.name || "Hotel Image"}
  className="w-full h-48 object-cover rounded-md"
  onError={(e) => (e.currentTarget.src = "")} // ✅ Handle broken images
/>


          {/* Hotel Details */}
          <div className="flex flex-col flex-1 p-4">
            {/* Hotel Name */}
            <Link href={`/hotels/${encodeURIComponent(hotel?.title || hotel?.name)}?checkInDate=${dateRange.startDate}&checkOutDate=${dateRange.endDate}`} className="hover:underline">
              <h2 className="text-xl font-semibold text-gray-900">{hotel.name}</h2>
            </Link>

            {/* Hotel Class & Location Rating */}
            <p className="text-sm text-gray-500 mt-1">{hotel.hotel_class} • ⭐ {hotel.location_rating} Location</p>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{hotel.description}</p>
            <a
                href={hotel.link}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-black font-semibold transition duration-200"
              >Go to Hotel website</a>
            {/* Star Rating & Reviews */}
            <div className="flex items-center mt-2">
              <p className="text-yellow-500 font-bold text-sm flex items-center">
                ⭐ {hotel.overall_rating} ({hotel.reviews} reviews)
              </p>
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-4">
            <p className="text-black font-bold text-lg">
  ${hotel.rate_per_night?.extracted_lowest ?? Math.floor(Math.random() * (120 - 70 + 1)) + 70} / night
</p>

              
              <a
                href={`/hotels/${encodeURIComponent(hotel?.title || hotel?.name)}?checkInDate=${dateRange.startDate}&checkOutDate=${dateRange.endDate}`}
                className=" bg-black text-white hover:bg-grey-700 px-4 py-2 rounded-lg shadow-md transition duration-300"
              >
                View Deal
              </a>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    // ✅ Show "No hotels found" if both 'hotels' and 'datehotel' are empty
    <p className="text-gray-600 text-lg text-center">No hotels found</p>
  )}
</div>



        
      </div>
    </>
  );
}
export default HotelListing;