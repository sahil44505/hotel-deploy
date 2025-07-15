"use client";
import { useSearchParams } from "next/navigation";
import HotelSearchResults from "./HotelSearchResults";
export default function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || ""; 
    console.log(query)
  
    return (
      <div className="mt-28">
       <HotelSearchResults title={query}  />
      </div>
    );
  }