'use client'
import { useState } from "react";

interface GuestSelectorProps {
  rooms: number;
  adults: number;
  children: number;
  onChange: (rooms: number, adults: number, children: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ rooms, adults, children, onChange }) => {
  const [tempRooms, setTempRooms] = useState(rooms);
  const [tempAdults, setTempAdults] = useState(adults);
  const [tempChildren, setTempChildren] = useState(children);
  const [childAges, setChildAges] = useState<number[]>(Array(children).fill(0));
  const [isOpen, setIsOpen] = useState(false);

  const handleChildrenChange = (newCount: number) => {
    if (newCount > tempChildren) {
      setChildAges([...childAges, 1]);
    } else {
      setChildAges(childAges.slice(0, newCount));
    }
    setTempChildren(newCount);
  };

  const handleUpdate = () => {
    if (childAges.includes(0)) return; // Prevent update if any child age is 0
    onChange(tempRooms, tempAdults, tempChildren);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="border p-3 rounded-md shadow-md w-[19vw] h-[11vh]">
        <p className="text-sm text-gray-500">Guests</p>
        <button onClick={() => setIsOpen(!isOpen)} className="flex rounded-lg text-black w-full text-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {rooms} room{rooms > 1 ? "s" : ""}, {adults} adults, {children} children
        </button>
      </div>
      {isOpen && (
        <div className="absolute bg-white p-4 shadow-lg border rounded-lg mt-2 w-[20vw]">
          <div className="flex justify-between items-center py-2">
            <span>Rooms</span>
            <div className="flex items-center space-x-2">
              <button onClick={() => setTempRooms(Math.max(1, tempRooms - 1))} className="px-2 py-1 border rounded">−</button>
              <span>{tempRooms}</span>
              <button onClick={() => setTempRooms(tempRooms + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Adults</span>
            <div className="flex items-center space-x-2">
              <button onClick={() => setTempAdults(Math.max(1, tempAdults - 1))} className="px-2 py-1 border rounded">−</button>
              <span>{tempAdults}</span>
              <button onClick={() => setTempAdults(tempAdults + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Children</span>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleChildrenChange(tempChildren - 1)} className="px-2 py-1 border rounded">−</button>
              <span>{tempChildren}</span>
              <button onClick={() => handleChildrenChange(tempChildren + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>
          <div className="py-2 max-h-32 overflow-y-auto">
            {childAges.map((age, index) => (
              <div key={index} className="flex flex-col my-1">
                <div className="flex justify-between items-center">
                  <span>Child {index + 1} age</span>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => {
                      const numericAge = e.target.value.replace(/\D/g, "");
                      const validAge = Math.min(17, Math.max(0, parseInt(numericAge) || 0));
                      const updatedAges = [...childAges];
                      updatedAges[index] = validAge;
                      setChildAges(updatedAges);
                    }}
                    className={`border rounded w-12 p-1 text-center ${age === 0 ? 'border-red-500' : ''}`}
                  />
                </div>
                {age === 0 && <span className="text-red-500 text-sm">Required</span>}
              </div>
            ))}
          </div>
          <button onClick={handleUpdate} className="bg-black text-white py-2 mt-3 w-full rounded-lg">
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
