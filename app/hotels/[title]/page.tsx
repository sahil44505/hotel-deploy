// app/hotels/page.tsx
import HotelCardComponent from "../HotelCardComponent";
import getbookings from "@/app/actions/getbookings";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface PageProps {
  params: { title: string };
  searchParams: { checkInDate?: string; checkOutDate?: string };
}

export default async function Hotelspage({ params, searchParams }: PageProps) {
  // Decode and convert parameters.
  const paramsi = await params
  const title = await decodeURIComponent(paramsi.title);
 
  // Fetch current user and bookings on the server.
  const currentUser = await getCurrentUser();
  let bookings: any = [];
  if (currentUser) {
    // For this example, assume that the currentUser's id is used as listingId.
    const listingId = currentUser.id;
    const userId = currentUser.id;
    bookings = await getbookings({ listingId, userId });
  }

  // Pass the parameters, current user, and bookings to the client component.
  return (
    <div className="mt-24">
    <HotelCardComponent
      title={title}
      
      bookings={bookings}
      currentUser={currentUser}
    />
    </div>
  );
}
