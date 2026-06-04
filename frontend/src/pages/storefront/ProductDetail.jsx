import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/storefront/Navbar';
import { useCart } from '../../context/CartContext';

const formatCurrencyNP = (amount) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0
    }).format(amount);
};

const ProductDetail = () => {
  // Using both id and slug to ensure it works regardless of App.jsx route param name
  const { id, slug } = useParams();
  const identifier = slug || id;
  
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://yeshi-bg5i.onrender.com/api/products/${identifier}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product', err);
        setError('Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    if (identifier) {
      fetchProduct();
    }
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs uppercase tracking-widest text-gray-400 animate-pulse">Loading Details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-sm uppercase tracking-widest text-gray-600">{error || 'Product not found.'}</div>
          <button onClick={() => window.history.back()} className="text-xs uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-gray-900 border-b border-gray-900 pb-1 transition-all duration-300">
            &larr; Go Back
          </button>
        </div>
      </div>
    );
  }

  const sizes = [...new Set(product.variations?.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(product.variations?.map(v => v.color).filter(Boolean))];
  const images = product.images || [];
  const displayPrice = product.basePrice ? product.basePrice / 100 : 0;

  const handleAddToCart = () => {
    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      alert('Please select size and color');
      return;
    }
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-[fade-in-up_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Images Section */}
          <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[700px] no-scrollbar shrink-0">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-28 relative overflow-hidden bg-gray-50 transition-all duration-300 hover:shadow-md ${currentImageIndex === idx ? 'border border-gray-900' : 'border border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img.secure_url} alt="" className={`w-full h-full object-cover transition-opacity duration-300 ${currentImageIndex === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 border-[0.5px] border-gray-200 bg-gray-50 overflow-hidden relative group">
              <img 
                src={images[currentImageIndex]?.secure_url || 'https://via.placeholder.com/600x800'} 
                alt={product.name} 
                className="w-full h-[500px] md:h-[700px] object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
              />
              {images.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-900 border-[0.5px] border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-900 border-[0.5px] border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            {/* Breadcrumb / Category */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 mb-6">
              <span className="hover:text-gray-900 transition-colors cursor-pointer">{product.category}</span>
              <span>/</span>
              <span className="hover:text-gray-900 transition-colors cursor-pointer">{product.subCategory}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4 text-gray-900">{product.name}</h1>
            <p className="text-xl font-medium text-gray-900 mb-8">{formatCurrencyNP(displayPrice)}</p>
            
            <p className="text-sm font-light leading-loose text-gray-500 mb-12 max-w-xl">
              {product.description}
            </p>
            
            <div className="space-y-8 mb-12">
              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs font-medium uppercase tracking-widest text-gray-900">Color</label>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">{selectedColor || 'Select a color'}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 border-[0.5px] uppercase tracking-widest text-xs transition-all duration-300 ${selectedColor === color ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs font-medium uppercase tracking-widest text-gray-900">Size</label>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 cursor-pointer hover:text-gray-900 hover:underline">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[4rem] px-6 py-3 border-[0.5px] uppercase tracking-widest text-xs transition-all duration-300 ${selectedSize === size ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-5 uppercase tracking-[0.2em] text-xs font-medium hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-xl group"
            >
              <span className="group-hover:scale-105 transition-transform duration-500 ease-out inline-block">
                Add to Cart
              </span>
            </button>
            
            {/* Trust Badges / Extra Info */}
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Free Shipping</span>
                 <span className="text-[10px] uppercase tracking-widest text-gray-400">On orders over Rs. 5000</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Easy Returns</span>
                 <span className="text-[10px] uppercase tracking-widest text-gray-400">Within 7 days of delivery</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
