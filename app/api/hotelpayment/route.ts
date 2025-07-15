import { NextResponse } from "next/server";
export async function POST(req:Request,res:Response){
   const body = await req.json()
   const{title}=body
   console.log(title)
   return NextResponse.json({title})
}