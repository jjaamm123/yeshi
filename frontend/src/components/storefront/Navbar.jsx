import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const megaMenuRef = useRef(null);

  // Close mega menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-light tracking-widest uppercase text-gray-900">
          Yeshii's
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex gap-10 items-center h-full relative" ref={megaMenuRef}>
          <button 
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 h-full flex items-center ${isMegaMenuOpen ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Shop
            <svg className={`ml-1 w-3 h-3 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Desktop Mega Menu Dropdown */}
          <div 
            className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white border border-gray-100 shadow-md rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
              isMegaMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
          >
            <div className="p-10 grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">Apparel</h3>
                <ul className="space-y-4">
                  {['Tops', 'Bottoms', 'Dresses', 'Innerwear', 'Outerwear'].map(sub => (
                    <li key={sub}>
                      <Link 
                        to={`/shop/apparel/${sub.toLowerCase()}`}
                        className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors duration-300"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">Shoes</h3>
                <ul className="space-y-4">
                  {['Sneakers', 'Flats', 'Heels', 'Boots'].map(sub => (
                    <li key={sub}>
                      <Link 
                        to={`/shop/shoes/${sub.toLowerCase()}`}
                        className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors duration-300"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
              <Link to="/shop/all" className="text-xs uppercase tracking-widest text-gray-900 font-medium hover:opacity-70 transition-opacity" onClick={() => setIsMegaMenuOpen(false)}>
                View All Collections &rarr;
              </Link>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Cart ({cartCount})
          </button>
        </div>

        {/* Mobile Cart Icon (Always visible) */}
        <div className="md:hidden flex items-center">
           <button 
            onClick={() => setIsCartOpen(true)}
            className="text-gray-900 focus:outline-none relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gray-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100 visible py-6' : 'max-h-0 opacity-0 invisible py-0'
        } overflow-hidden`}
      >
        <div className="px-6 space-y-8">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-100 pb-2">Apparel</h3>
            <ul className="space-y-4 pl-2">
              {['Tops', 'Bottoms', 'Dresses', 'Innerwear', 'Outerwear'].map(sub => (
                <li key={sub}>
                  <Link 
                    to={`/shop/apparel/${sub.toLowerCase()}`}
                    className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors duration-300 block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-100 pb-2">Shoes</h3>
            <ul className="space-y-4 pl-2">
              {['Sneakers', 'Flats', 'Heels', 'Boots'].map(sub => (
                <li key={sub}>
                  <Link 
                    to={`/shop/shoes/${sub.toLowerCase()}`}
                    className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors duration-300 block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <Link 
              to="/shop/all" 
              className="text-xs uppercase tracking-widest text-gray-900 font-medium block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              View All Collections &rarr;
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
