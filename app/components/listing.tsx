'use client'

const AddListing = () => {

  const handleAddListing = async () => {

    try {
      const listingData = {
        title: "Hotel Hilltop",
        description: "Looking for a place to stay in Gulmarg? Then look no further than Hotel Hilltop, a quaint hotel that brings the best of Gulmarg to your doorstep. Public wifi is offered to guests, and rooms at Hotel Hilltop offer a flat screen TV, a seating area, and a desk. During your stay, take advantage of some of the amenities offered, including 24 hour front desk, room service, and a concierge. Guests of Hotel Hilltop are also welcome to enjoy free breakfast, located on site. For travellers arriving by car, free parking is available. Close to Rani Temple (2.4 mi), a popular Gulmarg landmark, Hotel Hilltop is a great destination for tourists. While in Gulmarg, you may want to check out some of the restaurants that are a short walk away from Hotel Hilltop, including Bakshi (0.8 mi), Hotel Highlands Park (0.5 mi), and The Hunters Bar (0.9 mi). We’re sure you’ll enjoy your stay at Hotel Hilltop as you experience everything Gulmarg has to offer.",


        category: "Hotel",
        type: 'Skiing',
        roomCount: 10,
        price: 223,
        currency: "US",
        amenities: [
          "Ski-in/ski-out access",
          "Himalayan mountain views",
          "Wi-Fi access",
          "Flat-screen TVs",
          "Seating areas",
          "Tea and coffee makers",
          "Forest or mountain views",
          "Balconies (in some rooms)",
          "1- to 2-bedroom cottages with living rooms",
          "Upgraded cottages with kitchens and/or whirlpool baths",
          "2 refined restaurants (1 open-air)",
          "Cafe",
          "Hookah lounge",
          "Game room",
          "Kids' play area",
          "Spa",
          "Gym",
          "Heated indoor pool",
          "Breakfast available"

        ],
        gps_coordinates: {
          latitude:
            '34.0460431',
          longitude:
            '74.387532'
        },
        imageSrc: "/images/c3.jpg",
        guestsCount: 10,
        bedrooms: 10,
        beds: 10,
        bathroomCount: 10
      };

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Listing created:", data);
        alert('Listing added successfully!');
      } else {
        console.error("Failed to add listing:", response.statusText);
        alert('Failed to add listing');
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <button onClick={handleAddListing}>Add Listing</button>
    </div>
  );
};

export default AddListing;
