import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Navbar from '../../components/storefront/Navbar';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import { useCart } from '../../context/CartContext';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold uppercase tracking-tighter mb-8">Order Summary</h2>
          <div className="border border-black p-6 space-y-4 mb-8">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.basePrice * item.quantity / 100).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between pt-4 uppercase tracking-widest font-bold">
              <span>Total</span>
              <span>${(cartTotal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
