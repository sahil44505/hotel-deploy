'use client'

import { getListings } from "../actions/getListings";
const Getlisitng = () => {
    function handleAddListing(){
        const list = getListings()
        console.log(list)

    }
    
  return (
    <div>
       <button onClick={handleAddListing}>Get Listing</button>
    </div>
  );
}

export default Getlisitng;
