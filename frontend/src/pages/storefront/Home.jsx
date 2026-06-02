import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/storefront/Navbar';

const formatCurrencyNP = (amount) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0
    }).format(amount);
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const fetchedProducts = res.data.products || res.data;
        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Dynamic Luxury Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 border-b border-gray-100 overflow-hidden">
        
        {/* Subtle decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="z-10 text-center px-4 flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight uppercase mb-6 text-gray-900 opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            Less is More
          </h1>
          <p className="text-sm md:text-base font-light tracking-[0.3em] uppercase mb-12 max-w-lg text-gray-500 opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]">
            Minimalist casual wear for the modern woman.
          </p>
          
          <div className="opacity-0 animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards]">
            <Link 
              to="/shop/all"
              className="relative overflow-hidden group inline-flex bg-gray-900 text-white px-12 py-5 uppercase text-xs font-medium tracking-[0.2em] shadow-lg hover:shadow-2xl transition-all duration-500 ease-out"
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-out"></span>
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-500 ease-out inline-block">Shop Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Staggered New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 py-32 w-full bg-white rounded-t-3xl -mt-8 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-light tracking-[0.15em] uppercase text-gray-900">New Arrivals</h2>
          <div className="w-12 h-[1px] bg-gray-300 mt-6"></div>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-400 uppercase tracking-widest text-xs py-20 animate-pulse">
            Curating collection...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product, index) => {
              const priceToDisplay = product.basePrice ? product.basePrice / 100 : 0;
              const imgUrl = product.images && product.images.length > 0 ? product.images[0].secure_url : 'https://via.placeholder.com/400x600';

              return (
                <Link 
                  key={product._id || product.slug} 
                  to={`/product/${product._id || product.slug}`} 
                  className="group flex flex-col opacity-0 animate-[fade-in-up_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 shadow-sm group-hover:shadow-xl transition-shadow duration-700 ease-out mb-6">
                    <img 
                      src={imgUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                    {/* Subtle dark gradient overlay on hover for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-[11px] font-light tracking-[0.1em] text-gray-500">
                      {formatCurrencyNP(priceToDisplay)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {!loading && products.length > 0 && (
          <div className="mt-20 flex justify-center">
            <Link 
              to="/shop/all"
              className="text-xs uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-gray-900 border-b border-transparent hover:border-gray-900 pb-1 transition-all duration-300"
            >
              View Full Collection
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
