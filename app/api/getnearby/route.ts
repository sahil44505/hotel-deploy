import axios from "axios";
import { NextResponse } from "next/server"

export async function POST(req:any,res:any){
    const{location} = await req.json()
    
    const params = {
    engine: "google_maps",
    type: "search",
    google_domain: "google.com",
    q: "Hotels",
    ll: `@${location.lat},${location.lng},14z`,
    hl: "en",
    api_key: process.env.NEXT_PUBLIC_SERPAPI_KEY
    }
   
    try {
        const response = await axios.get('https://serpapi.com/search', { params });
       
        const hotels = response.data.local_results
      
      
        
      

        return NextResponse.json(hotels);
    } catch (error:any) {
        console.error('Error fetching hotel data:', error.message);
        return NextResponse.json({ error: 'Failed to fetch hotel data.' },{status:500});
    }
   
}