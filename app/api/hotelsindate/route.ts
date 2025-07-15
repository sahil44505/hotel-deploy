import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.title || !body?.checkIn || !body?.checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Format dates correctly
    const checkInDate = new Date(body.checkIn).toISOString().split("T")[0];
    const checkOutDate = new Date(body.checkOut).toISOString().split("T")[0];

    // Check if API key exists
    if (!process.env.NEXT_PUBLIC_SERPAPI_KEY) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const params = {
      engine: "google_hotels",
      q: body.title,
      hl: "en",
      gl: "us",
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      currency: "USD",
      api_key: process.env.NEXT_PUBLIC_SERPAPI_KEY,
    };

    const response = await axios.get("https://serpapi.com/search", { params });

    // ✅ Log response to debug API failures
  

    

    return NextResponse.json(response.data.properties);
  } catch (error: any) {
    
    return NextResponse.json("");
  }
}
