import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { ObjectId } from "mongodb";
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function GET(req:any,res:any){
    const existingUserId = new ObjectId('6790ba264b0111fae22e482c');
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('category') || 'India'
    console.log(query)
    if(query){
        try{
           

        
    
   
    // if (query){
    //     try { 
    //         const result:any = await prisma.places.findFirst({ 
    //         where: { id: existingUserId.toHexString() },
       
    //         }); 
    
    //         let newQueryKey = '';
    //         switch (query) {
    //             case 'Beach':
    //                 newQueryKey = 'beaches';
    //                 break;
    //             case 'Windmills':
    //                 newQueryKey = 'windmills';
    //                 break;
    //             case 'Modern':
    //                 newQueryKey = 'modern';
    //                 break;
    //             case 'Countryside':
    //                 newQueryKey = 'countryside';
    //                 break;
    //             case 'Pools':
    //                 newQueryKey = 'pools';
    //                 break;
    //             case 'Lake':
    //                 newQueryKey = 'lake';
    //                 break;
    //             case 'Islands':
    //                 newQueryKey = 'islands';
    //                 break;
    //             case 'Castles':
    //                 newQueryKey = 'castles';
    //                 break;
    //             case 'Skiing':
    //                 newQueryKey = 'skiing';
    //                 break;
    //             case 'Cave':
    //                 newQueryKey = 'cave';
    //                 break;
    //             case 'Camping':
    //                 newQueryKey = 'camping';
    //                 break;
    //             default:
    //                 return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    //         }

    //         const categoryData = result.category?.[newQueryKey];
            

    //         if (!categoryData) {
    //             return NextResponse.json({ error: 'No data found for the given category' }, { status: 404 });
    //         }

            
    //         return NextResponse.json({ category: query, data: categoryData }, { status: 200 });
                return NextResponse.json({status:200},)
     } catch (error) { 
        console.error('Error fetching places:', error); 
        return NextResponse.json({ error: 'An error occurred while fetching places' }, { status: 500 }); 
    } } else { 
        return NextResponse.json({ error: 'Category not provided' }, { status: 400 }); 
    }


}