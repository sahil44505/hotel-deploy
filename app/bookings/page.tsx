import Bookings from "./Bookings";
import getCurrentUser from "../actions/getCurrentUser";

const page = () => {
  async function getuser(){
    const user = await getCurrentUser();
  
  }
  getuser()
  
 
  if (!getuser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Please log in to view your bookings</h1>
      </div>
    );
  }
  return (
    <div className="mt-24">
      <Bookings/>
    </div>
  );
}

export default page;
