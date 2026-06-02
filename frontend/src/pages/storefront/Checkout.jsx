import Navbar from '../../components/storefront/Navbar';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import { useCart } from '../../context/CartContext';

const formatCurrencyNP = (amount) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0
    }).format(amount);
};

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  
  // Convert Paisa to raw Rs for calculations
  const subtotalRaw = cartTotal / 100;
  // Example flat shipping logic: Rs 150, free if subtotal > 5000
  const shippingRaw = subtotalRaw > 5000 || subtotalRaw === 0 ? 0 : 150;
  const grandTotalRaw = subtotalRaw + shippingRaw;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col lg:flex-row gap-16 lg:gap-24 w-full animate-[fade-in-up_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        
        {/* Order Summary Column */}
        <div className="lg:w-1/2 flex flex-col">
          <h2 className="text-xl font-light uppercase tracking-widest text-gray-900 mb-8">Order Summary</h2>
          
          <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-sm">
            <div className="space-y-6 mb-8">
              {cartItems.length === 0 ? (
                <p className="text-xs uppercase tracking-widest text-gray-400">Your cart is empty.</p>
              ) : (
                cartItems.map((item, idx) => {
                  const itemPriceRaw = (item.basePrice * item.quantity) / 100;
                  return (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-20 bg-gray-50 border-[0.5px] border-gray-200 overflow-hidden shrink-0">
                           <img src={item.images[0]?.secure_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium uppercase tracking-widest text-[11px] text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-xs text-gray-900">{formatCurrencyNP(itemPriceRaw)}</p>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Totals Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrencyNP(subtotalRaw)}</span>
              </div>
              
              <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-gray-500 pb-6 border-b border-gray-100">
                <span>Shipping</span>
                <span>{shippingRaw === 0 ? 'Free' : formatCurrencyNP(shippingRaw)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium uppercase tracking-widest text-gray-900">Total</span>
                <span className="text-lg font-medium text-gray-900">{formatCurrencyNP(grandTotalRaw)}</span>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Payment / Checkout Form Column */}
        <div className="lg:w-1/2 flex flex-col">
          <CheckoutForm />
        </div>
        
      </main>
    </div>
  );
};

export default Checkout;
