import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal } = useCart();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [customer, setCustomer] = useState({ name: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const { data: { clientSecret } } = await axios.post('http://localhost:5000/api/checkout/create-payment-intent', {
        items: cartItems.map(item => ({ id: item._id, quantity: item.quantity, priceAtPurchase: item.basePrice, size: item.size, color: item.color })),
        customerDetails: customer
      });

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: customer.name, email: customer.email }
        }
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
      }
    } catch (err) {
      setError(`Payment processing error: ${err.message}`);
      setProcessing(false);
    }
  };

  if (succeeded) return (
    <div className="text-center p-10 border border-black bg-gray-50">
      <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4">Payment Successful</h2>
      <p className="tracking-widest uppercase">Thank you for your order.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="border border-black p-8">
      <h2 className="text-2xl font-bold uppercase tracking-tighter mb-8">Secure Checkout</h2>
      
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm uppercase tracking-widest mb-2">Name</label>
          <input 
            type="text" 
            value={customer.name} 
            onChange={e => setCustomer({...customer, name: e.target.value})} 
            className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-widest mb-2">Email</label>
          <input 
            type="email" 
            value={customer.email} 
            onChange={e => setCustomer({...customer, email: e.target.value})} 
            className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" 
            required 
          />
        </div>
      </div>

      <div className="border border-black p-4 mb-8 bg-white">
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#000', '::placeholder': { color: '#aab7c4' } },
            invalid: { color: '#9e2146' }
          }
        }}/>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <button 
        disabled={processing || !stripe || !elements || cartItems.length === 0 || succeeded} 
        className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${(cartTotal / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
