'use client';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsArrowRight } from "react-icons/bs";


const CategoryPage = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category');
  
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchPlaces = async () => {
      if (category) {
        const result: any = await axios.get(`/api/getlistings?category=${category}`)
        

        setLocations(result.data)
        setLoading(false)
      }


    };

    fetchPlaces();
  }, [category]);

  return (
    <div className="container mx-auto p-4 top-36 absolute pl-2">
      
      {loading ? (
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
       <p className="text-2xl font-semibold text-gray-800">Getting your data...</p>
     </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {locations.map((item: any, index) => (
            <div key={index} className="col-span-1 cursor-pointer group">
              <div className="flex flex-col w-full gap-2">
                <div className="relative w-full overflow-hidden aspect-square rounded-xl">
                  <img
                    src={item.imageSrc}
                    

                    className="object-cover w-full h-full transition group-hover:scale-110"
                  />
                 
                  <div className="absolute top-3 right-3">
                    <div 
                    onClick={() => router.push(`/${category}/${item.title}`)}
                    className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition duration-300">
                      <BsArrowRight className="text-black" />
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  {item.title}
                </div>
                <div className="font-base text-black">
                  {item.amenities.slice(0,3).join(" | ")}
                </div>
                <div className="flex flex-row items-center gap-1">
                  <div className="font-semibold">$ {item.price}</div>
                  <div className="font-semibold">/ Night</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
