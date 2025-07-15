import getbookings from "@/app/actions/getbookings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import YouTubeResults from "@/app/components/YoutubeResults";
import prisma from "@/app/libs/prismadb";
import ListingClient from "./ListingClient";

interface PageProps {
  params: {
    category: string;
    title: string;
    listingId: string
    // listingId and userId are not needed if you're fetching them here
  };
}

export default async function Page({ params }: PageProps) {
  // Get the current user
  const currentUser: any = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not logged in");
  }
  const userId = currentUser.id;

  // Decode the title from the route parameter (remove await)
  const paramsi = await params
  const decodedTitle = decodeURIComponent(paramsi.title);

  // Retrieve the listing based on the decoded title
  const listing:any = await prisma.listings.findFirst({
    where: { title: decodedTitle },
  });
  console.log(listing)
  if (!listing) {
    throw new Error("Listing not found");
  }
  const listingId = listing.id;

  // Pass listingId and userId to getbookings
  const bookings:any = await getbookings({ listingId, userId });

  return (
    <div className="container mx-auto p-4 pt-28">
      <ListingClient
        currentUser={currentUser}
        listing={listing}
        bookings={bookings}
      />
      <h1 className="text-3xl font-bold mb-4">
        YouTube Search Results for: {decodedTitle}
      </h1>
      <YouTubeResults decodedTitle={decodedTitle} />
    </div>
  );
}
