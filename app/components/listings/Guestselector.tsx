import { useState } from "react";


interface GuestSelectorProps {
  rooms: number;
  adults: number;
  children: number;
  onChange: (rooms: number, adults: number, children: number) => void;
}
const GuestSelector : React.FC<GuestSelectorProps> = ({ rooms, adults, children, onChange }) => {
  const [tempRooms, setTempRooms] = useState(rooms);
  const [tempAdults, setTempAdults] = useState(adults);
  const [tempChildren, setTempChildren] = useState(children);

  const increment = (setter: any, value: number, max: number) => setter(value < max ? value + 1 : value);
  const decrement = (setter: any, value: number) => setter(value > 0 ? value - 1 : 0);

     const handleUpdate = () => {
      onChange(tempRooms, tempAdults, tempChildren);
        if (tempChildAges.includes(0)) return; // Prevent update if any child age is 0
        // setRooms(tempRooms);
        // setAdults(tempAdults);
        // setChildren(tempChildren);
        setChildAges(tempChildAges);
        setIsOpen(false);
    };
    
    const [childAges, setChildAges] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    
 
    const [tempChildAges, setTempChildAges] = useState<number[]>(childAges);

   

    // Handle children count
    const handleChildrenChange = (newCount: number) => {
        if (newCount > tempChildren) {
            setTempChildAges([...tempChildAges, 1]); // Default new child age to 1
        } else {
            setTempChildAges(tempChildAges.slice(0, newCount));
        }
        setTempChildren(newCount);
    };

    // Handle child age input
    const handleChildAgeChange = (index: number, age: string) => {
        const numericAge = age.replace(/\D/g, ""); // Remove non-numeric characters
        const validAge = Math.min(17, Math.max(0, parseInt(numericAge) || 0));
        const updatedAges = [...tempChildAges];
        updatedAges[index] = validAge;
        setTempChildAges(updatedAges);
    };

    // Apply changes on update
 

    return (
        <div className="w-full max-w-sm">
          
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 ml-2 flex border border-black rounded-lg text-black w-full text-left"
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {rooms} room{rooms > 1 ? "s" : ""}, {adults} adults, {children} children
            </button>

            {/* Dropdown Content (Visible When Open) */}
            {isOpen && (
                <div className="bg-white p-4 shadow-lg border rounded-lg mt-2 w-full">
                    {/* Rooms Selector */}
                    <div className="flex justify-between items-center py-2">
                        <span>Rooms</span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => decrement(setTempRooms, tempRooms)} className="px-2 py-1 border rounded">−</button>
                            <span>{tempRooms}</span>
                            <button onClick={() => increment(setTempRooms, tempRooms, 8)} className="px-2 py-1 border rounded" disabled={tempRooms >= 8}>+</button>
                        </div>
                    </div>

                    {/* Adults Selector */}
                    <div className="flex justify-between items-center py-2">
                        <span>Adults</span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => decrement(setTempAdults, tempAdults)} className="px-2 py-1 border rounded">−</button>
                            <span>{tempAdults}</span>
                            <button onClick={() => increment(setTempAdults, tempAdults, 30)} className="px-2 py-1 border rounded" disabled={tempAdults >= 30}>+</button>
                        </div>
                    </div>

                    {/* Children Selector */}
                    <div className="flex justify-between items-center py-2">
                        <span>Children</span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleChildrenChange(tempChildren - 1)} className="px-2 py-1 border rounded">−</button>
                            <span>{tempChildren}</span>
                            <button onClick={() => handleChildrenChange(tempChildren + 1)} className="px-2 py-1 border rounded" disabled={tempChildren >= 20}>+</button>
                        </div>
                    </div>

                    {/* Child Age Inputs */}
                    <div className="py-2 max-h-32 overflow-y-auto">
                        {tempChildAges.map((age, index) => (
                            <div key={index} className="flex flex-col my-1">
                                <div className="flex justify-between items-center">
                                    <span>Child {index + 1} age</span>
                                    <input
                                        type="text"
                                        value={age}
                                        onChange={(e) => handleChildAgeChange(index, e.target.value)}
                                        className={`border rounded w-12 p-1 text-center ${age === 0 ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {age === 0 && <span className="text-red-500 text-sm">Required</span>}
                            </div>
                        ))}
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={handleUpdate}
                        className="bg-black text-white py-2 mt-3 w-full rounded-lg"
                    >
                        Update
                    </button>
                </div>
            )}
        </div>
    );
};

export default GuestSelector;
