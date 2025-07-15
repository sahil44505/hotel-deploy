import axios from 'axios';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// const prisma = new PrismaClient();

// type Camping = {
//   title: string;
//   placeId: string;
//   gps_coordinates: any;
//   rating: number;
//   reviews: number;
//   address: string;
//   thumbnail: string;
//   types: string[];
// };

// type PlaceCategory = {
//   camping?: Camping[];
//   // Define other categories as needed
// };

export async function GET(req: any) {
  const existingUserId = new ObjectId('6790ba264b0111fae22e482c');

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const API_KEY = process.env.SERP_API_KEY;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('category') || 'Hotels in India';
  console.log(query);

  const params = {
   
    engine: "google_hotels",
    q: "Bali+Resorts",
    hl: "en",
    gl: "us",
    check_in_date: "2025-03-28",
    check_out_date: "2025-03-29",
    currency: "USD",
     
      
    api_key: API_KEY,
  };

  try {
    const response = await axios.get('https://serpapi.com/search', { params });
    const loc = response.data.local_results || [];
    console.log(loc)
    if (!loc.length) {
      return NextResponse.json({ message: `No locations found for ${query}.` }, { status: 404 });
    }

    // try {
    //   console.log('hello');

    //   const newCampingData: Camping[] = loc.map((loca: any) => ({
    //     title: loca.title || 'Unknown Title',
    //     placeId: loca.place_id || 'Unknown Place ID',
    //     gps_coordinates: loca.gps_coordinates || { lat: 0, lng: 0 },
    //     rating: loca.rating || 0,
    //     reviews: loca.reviews || 0,
    //     address: loca.address || 'Unknown Address',
    //     thumbnail: loca.thumbnail || 'path/to/default-thumbnail.jpg',
    //     types: loca.types || ['Unknown Type'],
    //   }));

    //   // Fetch existing category data
    //   const existingPlace = await prisma.places.findUnique({
    //     where: { id: existingUserId.toHexString() },
    //   });

    //   if (existingPlace) {
    //     // Append new data to existing category data
    //     const existingCategory: PlaceCategory = existingPlace.category as PlaceCategory || {};
    //     existingCategory.camping = existingCategory.camping ? existingCategory.camping.concat(newCampingData) : newCampingData;

    //     await prisma.places.update({
    //       where: { id: existingUserId.toHexString() },
    //       data: {
    //         category: existingCategory,
    //       },
    //     });
    //   } else {
    //     await prisma.places.create({
    //       data: {
    //         userId: existingUserId.toHexString(),
    //         category: {
    //           camping: newCampingData,
    //         },
    //       },
    //     });
    //   }

    //   console.log(newCampingData);
    // } catch (e) {
    //   console.log(e);
    // } finally {
    //   await prisma.$disconnect();
    // }

    return NextResponse.json(loc);
  } catch (e: any) {
    console.error('Error fetching data:', e.message);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
