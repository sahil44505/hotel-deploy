'use server'
import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export async function getListings() {
    try {
        const user = getCurrentUser()
        if (!user) {
            console.log('User not found')
            return 0
        }
        const listing = await prisma.listings.findMany({
            where: {
                type: "Beach"
            }
        })
        console.log(listing)
        


    } catch (e) {
        console.log(e)
    }


}

