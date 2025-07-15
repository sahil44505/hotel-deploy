'use client';
import Button from './Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
import { toast } from 'sonner';

interface PaymentProps {
  totalPrice?: number;
  onSubmit: () => void;
  estimatedCost?: number;
}

const Payment: React.FC<PaymentProps> = ({ totalPrice, onSubmit, estimatedCost }) => {
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);

  // Load Cashfree SDK once when the component mounts
  useEffect(() => {
    async function initializeSDK() {
      const cfInstance = await load({ mode: 'sandbox' });
      setCashfree(cfInstance);
    }
    initializeSDK();
  }, []);

  async function handlePayment() {
    if (!cashfree) {
      toast.error('Payment service is not initialized yet. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const api = totalPrice ? '/api/createOrder' : '/api/booktaxi';
      
      const amount = totalPrice || estimatedCost;
      
      if (!amount) {
        toast.error('Invalid payment amount.');
        setLoading(false);
        return;
      }

      // Call the appropriate API
      const res = await axios.post(api, { amount });
      const payment_session_id = res.data.session_id;

      let checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: '_modal',
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          
          toast.error('Payment failed. Please try again.');
        } else if (result.paymentDetails) {
          console.log('Payment successful:', result.paymentDetails.paymentMessage);
          toast.success('Payment Successful');
          onSubmit();
        }
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {totalPrice ? (
        <div className="p-4">
          <Button onClick={handlePayment} disabled={loading} label={loading ? 'Processing...' : 'Pay Now'} />
        </div>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      )}
    </>
  );
};

export default Payment;
