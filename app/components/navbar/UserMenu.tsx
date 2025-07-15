'use client';


import Avatar from "../Avatar";
import { useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { User } from "next-auth";

import { useRouter } from 'next/navigation';

interface UserMenuProps {
    currentUser?: User | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
     const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Function to close dropdown when clicking outside
        const handleClickOutside = (event:any) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
    
        // Attach event listener
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }
    const router = useRouter()
    const tripsclick = ()=>{
     
        router.push('/Trips')
    }


    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={() => {router.push('/reccomendations') }}
                    className="
                hidden
                md:block
                
                py-3
                px-4
                rounded-full
                 text-base
                font-semibold
                hover:bg-neutral-100
                transition
                hover:underline
                cursor-pointer">
                    Recommendations
                </div>
                <div
                    onClick={toggleMenu}
                    className="
                p-4
                md:py-1
                md:px-2
                border-[1px]
                border-neutral-200
                flex
                flex-row
                items-center
                gap-3
                rounded-full
                cursor-pointer
                hover:shadow-md
                transition">
                   
                    <div className="hidden md:block">
                        <Avatar />
                    </div>
                </div>
                {
                    isOpen && (
                        <div className="
            absolute
            rounded-xl
            shadow-md
            w-[40vw]
            md:w-3/4
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm ">
                            <div className="flex flex-col cursor-pointer">
                                
                                {currentUser ? (
                                   
                                    <>
                                     

                                        <MenuItem
                                            onClick={() => {router.push('/bookings') }}
                                            label="My Bookings"
                                        />
                                        <MenuItem
                                            onClick={tripsclick}
                                            label="My Trips"
                                        />
                                       
                                        <hr />
                                        <LogoutLink>
                                    
                                            <MenuItem
                                                onClick={() => { }}
                                                label="Logout"
                                            />
                                        </LogoutLink>




                                    </>

                                ) : (
                                <>
                                    <LoginLink>
                                    
                                  
                                        <MenuItem
                                            onClick={() => {}}
                                            label="Login"
                                        />
                                    </LoginLink>

                                </>
                                )}
                            </div>
                        </div>
                    )}
            </div>





        </div>
    );
}

export default UserMenu;
