
import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(req:Request,res:Response){
  
   const body = await req.json()
   const{title,checkIn,checkOut} = body
    
    const checkInDate = new Date(checkIn).toISOString().split("T")[0];
    const checkOutDate = new Date(checkOut).toISOString().split("T")[0];


    // Parameters for SerpApi
    const params = {
        engine: "google_hotels",
        q: title,
        hl: "en",
        gl: "us",
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        currency: "USD",
        api_key: process.env.NEXT_PUBLIC_SERPAPI_KEY,
    };

    try {
        const response = await axios.get('https://serpapi.com/search', { params });
       
        const hotels = response.data || response.data.properties
      
        
      

        return NextResponse.json(hotels);
    } catch (error:any) {
        console.error('Error fetching hotel data:', error.message);
        return NextResponse.json({ error: 'Failed to fetch hotel data.' },{status:500});
    }
}