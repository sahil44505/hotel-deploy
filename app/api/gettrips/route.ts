import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '../../libs/prismadb'

export async function GET() {
    try {
      
        const user: any = await getCurrentUser();

       

    

        // Fetch all trips for the user
        const getTrips = await prisma.trips.findMany({
            where: { userId:user.id } 
        });

        if (getTrips.length === 0) {
            return NextResponse.json({ message: "No trips found" }, { status: 404 });
        }

        return NextResponse.json({ trips: getTrips }, { status: 200 });
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
