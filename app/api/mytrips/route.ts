
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
export async function POST(req:Request){
  const user:any = await getCurrentUser()
  const tripsId:any = user.id
  const body = await req.json()
  const {
    
    estimatedCost,
    originText,
    destinationText,
    route,
    distanceInKm,
    duration,
    directionsResult
  } = body
  try{
    if (!body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    console.log(body)
    if(!user){
      return NextResponse.json({error:"User not logged in"},{status:400})
    }
    const mytripsdata = await prisma.trips.create({
      data:{
        user: {
          connect: { id: user.id }
        },
        tripsId: tripsId,
        estimatedCost: estimatedCost,
        originText: originText,
        destinationText: destinationText,
        route: route,
        distanceInKm: distanceInKm,
        duration: duration,
        directionsResult: directionsResult
      }
    })
    return NextResponse.json(
      { status: 201, mytripsdata}
    )
  } catch (error) {
    console.log("Error creating trips:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  

 
}