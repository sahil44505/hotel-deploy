import prisma from "@/app/libs/prismadb";
const listing = await prisma.listings.findFirst({
    where: { title: 'Agonda beach' },
    select: { id: true },
  });
  
  if (listing) {
    console.log('Listing ID:', listing.id);
  } else {
    console.log('No listing found with the title "Agonda beach".');
  }