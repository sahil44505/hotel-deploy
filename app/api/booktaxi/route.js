import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";
import { randomBytes } from "crypto";
import getCurrentUser from "@/app/actions/getCurrentUser";


Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.NEXT_PUBLIC_CASHFREE_APP_MODE;
const exchangeRate = 80;


export async function POST(req) {
  try {
    const user = await getCurrentUser()
    const name = user.firstName || "default"
    const email = user.email || "default@gmail.com"
    const id = user.id || "12324"
    const { amount } = await req.json();
    
    const priceInINR = (amount * exchangeRate).toFixed(2);
    console.log(priceInINR)
   
    const price =  priceInINR.toString()



    var request = {
      "order_amount":price,
      "order_currency": "INR",
      
      "customer_details": {
        "customer_id": id,
        "customer_name": name,
        "customer_email": email,
        "customer_phone": "9999999999"
      },
      "order_meta": {
        "return_url": "http://localhost:3000/payment-status?order_id={order_id}"
      },
      "order_note": "nothn"
    }

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    const absolutepayment = response.data;
    
    const order_id = absolutepayment.order_id
   
   
    
    //payment status
 
    let version = "2023-08-01"
     Cashfree.PGFetchOrder(version, order_id).then((response) => {
   
      console.log("Ok")
    }).catch((error) => {
      console.error('Error:', error.response.data.message);
    });



    if (absolutepayment) {

      const session_id = absolutepayment.payment_session_id
      return NextResponse.json({ session_id }, { status: 201 })
    } else {
      return NextResponse.json({
        error: "Failed to create payment session"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Order creation error:", error

    );


    return NextResponse.json(
      { error: error.message || "Payment creation failed" },
      { status: 500 }
    );
  }
}
