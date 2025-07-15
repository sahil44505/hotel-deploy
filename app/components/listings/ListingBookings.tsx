"use client";

import { Range } from "react-date-range";

import Calendar from "../inputs/Calendar";
import Payment from "../Payment";
import GuestSelector from "./Guestselector";
import { useState } from "react";


interface ListingBookingProps {
  price: number;
  totalPrice: number;
  dateRange: Range;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled: boolean;
  disabledDates?: Date[];
  rooms:number;
  adults:number;
  children:number;
  onGuestChange: (newRooms: number, newAdults: number, newChildren: number) => void;
  
 
}

const ListingBookings: React.FC<ListingBookingProps> = ({

  price,

  totalPrice,
  onChangeDate,
  dateRange,
  onSubmit,
  disabled,
  disabledDates,
  rooms,
  adults,
  children,
  onGuestChange
}) => {
  

  return (
    <div className="bg-white rounded-xxl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">Night</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <div className="p-2">
      <GuestSelector rooms={rooms} adults={adults} children={children} onChange={onGuestChange} />
      </div>
      <div className="p-2">
      <Payment totalPrice={totalPrice} onSubmit={onSubmit} />
      </div>
      
      
      
      <hr />
      <div className="flex flex-row items-center justify-between p-4 text-lg font-semibold">
        <div>Total</div>
        <div>$ {totalPrice}</div>
      
      </div>
       <hr/>
      
        
   

      
    </div>
  );
};

export default ListingBookings;
