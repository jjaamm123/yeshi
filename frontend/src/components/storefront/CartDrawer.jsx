import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
      <div className="w-full max-w-md bg-white h-full relative z-10 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-black flex justify-between items-center">
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-2xl font-light hover:opacity-50">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <p className="uppercase tracking-widest text-gray-500">Cart is empty.</p>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b border-gray-200 pb-4">
                <img src={item.images[0]?.secure_url} alt={item.name} className="w-20 h-24 object-cover border border-black" />
                <div className="flex-1">
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">Size: {item.size} | Color: {item.color}</p>
                  <p className="text-sm font-medium">${(item.basePrice / 100).toFixed(2)} x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item)} className="text-xs uppercase hover:underline">Remove</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-black bg-gray-50">
            <div className="flex justify-between mb-6">
              <span className="uppercase tracking-widest font-bold">Subtotal</span>
              <span className="font-bold">${(cartTotal / 100).toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
