'use client'
export const dynamic = "force-dynamic";

import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import Hero from "./components/Hero/Hero";
import Categories from "./components/navbar/Categories";

import SearchHero from "./components/search/SearchHero";
import Nearby from "./components/Nearby";
import CategoryHeader from "./components/CategoryHeader";



export default function Home() {
  const [nearbyHotels, setNearbyHotels] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch('/api/auth-check');
      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    }

    checkAuth();
  }, []);

 
  
 useEffect(()=>{
 
   const gettoast = () => {
    const hasShownToast =  sessionStorage.getItem("hasShownToast");
    if (hasShownToast){
      return 0
    }
    if (isAuthenticated) {
      
  
      if (!hasShownToast) {
        toast.success("Logged in successfully");
        sessionStorage.setItem("hasShownToast", "true");
      }
      
    }else{ 
    if(hasShownToast){
      sessionStorage.removeItem('hasShownToast')
    }
  }
    }
  
 
  
  gettoast()
 
 

  },[isAuthenticated])
   
  
    

  return (
    <>
    <Hero/>
    
    <SearchHero setNearby={setNearbyHotels}/>
    <CategoryHeader/>
   
    
    <Categories/>
    <Nearby hotels={nearbyHotels}/>
     
    </>
  );
}
