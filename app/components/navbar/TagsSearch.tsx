'use client';


import axios from "axios";
import { useRouter } from "next/navigation";




const Search = () => {
    const router = useRouter()
    async function MyBookings(){
        router.push('/bookings')
    }
    return (
        <>
            <div className=" 
        
         w-[full]
         md:w-auto
         
         py-2
        
         
        ">
            
                <div className="
        flex
        flex-row
        items-center
        gap-4
        justify-between">
                    <div onClick={()=>{router.push('/Trips')}}
                        className="
            text-base
            font-semibold
            px-4
            hover:underline
            "
                    > Trips</div>
                   
                    {/* <div className="
             text-base
            font-semibold
            hover:underline
            px-4">

                         Profile
                    </div> */}
                    <div className="
             text-base
            font-semibold
            hover:underline
            px-4" 
            onClick={MyBookings}>
                        Bookings

                    </div>



                </div>

            </div>




        </>
    );
}

export default Search;
