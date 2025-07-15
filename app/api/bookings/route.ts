import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser";
export async function POST(req: Request) {
    const user:any = await getCurrentUser()
  try {
    const body = await req.json();
    const { title, totalPrice,rating, startDate, endDate ,gps_coordinates,img} = body;
    
   
   
    const listingid = user.id.toString()
   

    // Create a new booking in the database
    const booking = await prisma.bookings.create({
      data: {
        userId:user?.id,
        Image:img,
        ratings:rating,
        listingId:listingid,
        title,
        totalPrice,
        gps_coordinates,
        startDate: new Date(startDate), // Ensure proper date formatting
        endDate: new Date(endDate),
       
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
