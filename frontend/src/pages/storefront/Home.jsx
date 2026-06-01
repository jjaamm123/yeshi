import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/storefront/Navbar';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([
      { _id: '1', name: 'Linen Slip Dress', basePrice: 8500, images: [{ secure_url: 'https://via.placeholder.com/400x500' }] },
      { _id: '2', name: 'Minimalist Loafers', basePrice: 12000, images: [{ secure_url: 'https://via.placeholder.com/400x500' }] },
      { _id: '3', name: 'Oversized Cotton Shirt', basePrice: 6500, images: [{ secure_url: 'https://via.placeholder.com/400x500' }] },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="h-[70vh] flex flex-col items-center justify-center border-b border-black text-center p-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-6">Less is More</h1>
        <p className="text-xl tracking-widest uppercase mb-10 max-w-lg">Minimalist casual wear for the modern woman.</p>
        <button className="bg-black text-white px-10 py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors">
          Shop Collection
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold tracking-tighter uppercase mb-12 text-center">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => (
            <Link key={product._id} to={`/product/${product._id}`} className="group block">
              <div className="border border-black overflow-hidden mb-4">
                <img 
                  src={product.images[0]?.secure_url} 
                  alt={product.name} 
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium uppercase tracking-widest">{product.name}</h3>
                <p className="text-lg">${(product.basePrice / 100).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
