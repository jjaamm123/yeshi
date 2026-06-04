import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const formatCurrencyNP = (amount) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0
    }).format(amount);
};

const CartDrawer = () => {
  const { cartItems, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className="w-full max-w-md bg-white h-full relative z-10 flex flex-col shadow-2xl animate-[fade-in-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-medium uppercase tracking-[0.2em] text-gray-900">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="text-2xl font-light text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
          >
            &times;
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="uppercase tracking-[0.2em] text-xs text-gray-500 font-medium">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="w-24 h-32 shrink-0 bg-white border-[0.5px] border-gray-200 overflow-hidden relative">
                  <img src={item.images[0]?.secure_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium uppercase tracking-widest text-xs mb-2 text-gray-900">{item.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Size: {item.size}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Color: {item.color}</p>
                    <p className="text-xs font-medium text-gray-900">
                      {formatCurrencyNP(item.basePrice / 100)} <span className="text-gray-400 font-light ml-1">x {item.quantity}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item)} 
                    className="self-start text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 border-b border-transparent hover:border-gray-900 pb-[2px] transition-all duration-300 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Subtotal */}
        {cartItems.length > 0 && (
          <div className="p-8 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-end mb-8">
              <span className="uppercase tracking-[0.2em] text-xs font-medium text-gray-500">Subtotal</span>
              <span className="text-xl font-medium text-gray-900">{formatCurrencyNP(cartTotal / 100)}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-6 text-center">Shipping & taxes calculated at checkout</p>
            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-gray-900 text-white py-5 uppercase tracking-[0.2em] text-xs font-medium hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-xl group"
            >
              <span className="group-hover:scale-105 transition-transform duration-500 ease-out inline-block">
                Proceed to Checkout
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
