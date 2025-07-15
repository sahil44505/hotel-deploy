import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { toast } from "sonner";





const ToastMESSAGE = async() => {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    console.log(isUserAuthenticated);

    if (isUserAuthenticated && user) {
      console.log("User is authenticated");
      toast.success("Logged in successfully");
    }

    console.log(user);
  
}

export default ToastMESSAGE;
