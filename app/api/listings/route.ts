import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Adjust this import if needed
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request:any) {
  try {
    const user:any =await getCurrentUser()
    console.log(user)
   
    const body = await request.json();

    // Ensure that all required fields are provided in the request body
    if (!body.title || !body.description || !body.category || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the listing in the database
    const newListing = await prisma.listings.create({
      data: {
        userId: user.id,  
        title: body.title,
        description: body.description,
        category: body.category,
        type : body.type,
        roomCount: body.roomCount,
        price: body.price,
        currency: body.currency,
        amenities: body.amenities,
        gps_coordinates: body.gps_coordinates,
        imageSrc: body.imageSrc,
        guestsCount: body.guestsCount,
        bedrooms: body.bedrooms,
        beds: body.beds,
        bathroomCount: body.bathroomCount,
      },
    });

    // Return the newly created listing as a response
    return NextResponse.json(newListing, { status: 201 });

  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
