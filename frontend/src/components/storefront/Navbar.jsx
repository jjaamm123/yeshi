import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  
  return (
    <nav className="border-b border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter uppercase">Yeshii's</Link>
        <div className="flex gap-6">
          <Link to="/" className="text-sm font-medium uppercase tracking-widest hover:opacity-50">Shop</Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-sm font-medium uppercase tracking-widest hover:opacity-50"
          >
            Cart ({cartCount})
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
