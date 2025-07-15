import axios from "axios";

import { NextResponse } from "next/server";
import getCurrentUser from "../../actions/getCurrentUser";
export async function POST(req:any, res:any) {
    const currentUser:any= await getCurrentUser();
    console.log("fro searchhotelsforpy",currentUser)
    const{title} = await req.json()
    console.log(title)
    const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];
console.log(formatDate(today))
   
    
  
  
   


const params = {
    api_key: process.env.NEXT_PUBLIC_SERPAPI_KEY,
    engine: "google_hotels",
    q: "Hotels similar to " + title,
    gl: "us",
    hl: "en",
    currency: "USD",
    check_in_date: formatDate(today),
    check_out_date: formatDate(tomorrow),
    adults: 2,
    children: 0
  };
  
    
   
    try {
       
        const response = await axios.get('https://serpapi.com/search', { params });
        const hotels = response.data
       
     
        const properties = response.data.properties
        
        const ads = response.data.ads
    
       
        const results =response.data.answer_box?.hotels
        const knowledgeGraph = response.data.knowledge_graph;
        
        let data;

        // If ads exist, return ads
        if (ads && ads.length > 0) {
            data = ads;
        }
        if(properties && properties.length > 0){
            data = properties;
        }
        // If results exist, return results
        else if (results && results.length > 0) {
            data = results;
           
        }else if(hotels.error){
          
            return NextResponse.json({ msg: "No hotel data found" });
        }
        // If both ads and results are empty, extract from knowledge_graph
        else if (knowledgeGraph) {
            data = [{
                title: knowledgeGraph.title ,
                thumbnail: knowledgeGraph.thumbnail ,
             
                rating: knowledgeGraph.rating ,
               
               
                description: knowledgeGraph.description ,
               
                website: knowledgeGraph.website ,
               
                price: knowledgeGraph.pricing?.offers?.[0]?.price ,
                source: knowledgeGraph.pricing?.offers?.[0]?.source , // First booking link
                tracking_link : knowledgeGraph.pricing?.offers?.[0]?.link ,
                
        }];
            
        } else {
            return NextResponse.json({ msg: "No hotel data found" });
        }
       if (data.length ===0){
       
        return NextResponse.json({ msg: "No hotel data found" });
       }
       console.log(data);
        return NextResponse.json({ data:data });

      
       
        

       
    } catch (err) {
        console.error(err)
        return NextResponse.json({msg:"Error finding hotels"})
        
    }
}
