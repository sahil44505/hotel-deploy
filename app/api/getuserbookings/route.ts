// pages/api/bookings/index.ts
import { NextResponse } from "next/server";
import  prisma  from "@/app/libs/prismadb"; // Adjust import according to your setup
import getCurrentUser from "../../actions/getCurrentUser"; // Adjust import according to your setup
export async function GET() {
  const currentUser:any= await getCurrentUser();
 
  if (!currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const bookings = await prisma.bookings.findMany({
      where: {
        userId: currentUser.id, 
      },
      select: {
        Image:true,
        title: true,
        ratings: true,
        totalPrice: true,
        startDate: true,
        endDate: true,
        gps_coordinates: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Error fetching bookings" }, { status: 500 });
  }
}
