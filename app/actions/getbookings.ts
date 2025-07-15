import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  
}

export default async function getbookings(params: IParams) {
  try {
    const { listingId, userId,  } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = userId;
    }

    if (userId) {
      query.userId = userId;
    }
 
   

    const bookings = await prisma.bookings.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
 
    const safebookings = bookings.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        // createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));
    

    return safebookings;
  } catch (error: any) {
    throw new Error(error);
  }
}
