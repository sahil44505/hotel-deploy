
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/libs/prismadb";



export default async function getCurrentUser() {
   try{
   
    const {getUser} = getKindeServerSession();
   
    const user = await getUser();
    if (!user || !user.id) return null;
    console.log("User:", user.id);
  
 
    let dbUser = await prisma.user.findUnique({
        where: {kindeId: user.id}
    });

    if (!dbUser) {
       return null
    }
    
    
    console.log("Current user:", dbUser);
    return dbUser;

    

   }catch(e){
    console.log(e)
   }
}