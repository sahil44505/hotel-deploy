// pages/api/bookings/index.ts
import { NextResponse } from "next/server";
import  prisma  from "@/app/libs/prismadb"; 
import getCurrentUser from "../../actions/getCurrentUser"; 
export async function GET() {
  
  try {
    const currentUser= await getCurrentUser();
 console.log("gdfgdf", currentUser);
 
    const bookings = await prisma.bookings.findMany({
      where: {
        userId: currentUser?.id, // Filter by current user's ID
      },
      select: {
       
        title: true,
        ratings: true,
        totalPrice: true,
        startDate: true,
        endDate: true,
        gps_coordinates: true,
      },
    });
    console.log("My bookings :",bookings)
   
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Error fetching bookings" }, { status: 500 });
  }
}
