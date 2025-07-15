import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body.price, "Price")
        console.log(body.hotel_class, "hotelclass")
        console.log(body.amenity, "Amenity")
        console.log(body.title, "title")
        if (!body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Format dates correctly
        const checkInDate = new Date(body.checkIn).toISOString().split("T")[0];
        const checkOutDate = new Date(body.checkOut).toISOString().split("T")[0];

        // Check if API key exists
        if (!process.env.NEXT_PUBLIC_SERPAPI_KEY) {
            return NextResponse.json({ error: "API key is missing" }, { status: 500 });
        }
      
        const amenities = body.amenity.join(',');
       
        const hotelClass = body.hotel_class.join(',')
        const max = body.price[1]
        const min = 1


        const params = {
            engine: "google_hotels",
            q: body.title,
            hl: "en",
            gl: "us",
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            currency: "USD",
            amenities: amenities,
            min_price: min,
            max_price: max,
            hotel_class: hotelClass,
            api_key: process.env.NEXT_PUBLIC_SERPAPI_KEY,
        };


        const response = await axios.get("https://serpapi.com/search", { params });

       console.log(response.data.properties)




        return NextResponse.json(response.data.properties);
    } catch (error: any) {

        return NextResponse.json("");
    }
}
