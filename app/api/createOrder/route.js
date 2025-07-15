
import { Cashfree } from "cashfree-pg";

import getCurrentUser from "@/app/actions/getCurrentUser";


Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
const exchangeRate = 86;

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    const name = user?.firstName || "default";
    const email = user?.email || "default@gmail.com";
    const id = user?.id || "12324";
    const { amount } = await req.json();
    const priceInINR = (amount * exchangeRate).toFixed(2);

    const price = priceInINR.toString();

    var request = {
      order_amount: price,
      order_currency: "INR",
      customer_details: {
        customer_id: id,
        customer_name: name,
        customer_email: email,
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: "http://localhost:3000/payment-status?order_id={order_id}",
      },
      order_note: "nothn",
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    const absolutepayment = response.data;

    const order_id = absolutepayment.order_id;

    // Payment status check
    let version = "2023-08-01";
    Cashfree.PGFetchOrder(version, order_id)
      .then(() => {
        console.log("Order status fetched successfully");
      })
      .catch((error) => {
        console.error("Error fetching order:", error.response?.data?.message);
      });

    if (absolutepayment) {
      const session_id = absolutepayment.payment_session_id;

    const responseHeaders = new Headers();
      responseHeaders.append("Access-Control-Allow-Origin", "*");
      responseHeaders.append("Access-Control-Allow-Credentials", "true");
      responseHeaders.append("Content-Type", "application/json");

      return new Response(JSON.stringify({ session_id }), {
        status: 201,
        headers: responseHeaders,
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to create payment session" }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Order creation error:", error);

    return new Response(
      JSON.stringify({ error: error.message || "Payment creation failed" }),
      { status: 500 }
    );
  }
}
