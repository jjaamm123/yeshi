import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/storefront/Navbar';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setProduct({
      _id: id,
      name: 'Linen Slip Dress',
      description: 'A beautifully crafted linen slip dress with an ultra-minimalist silhouette. Perfect for casual outings or elevated evenings.',
      basePrice: 8500,
      variations: [
        { size: 'S', color: 'Black', stockCount: 5 },
        { size: 'M', color: 'Black', stockCount: 2 },
        { size: 'L', color: 'White', stockCount: 0 }
      ],
      images: [
        { secure_url: 'https://via.placeholder.com/600x800' },
        { secure_url: 'https://via.placeholder.com/600x800?text=Image+2' }
      ]
    });
  }, [id]);

  if (!product) return <div className="p-10 uppercase tracking-widest">Loading...</div>;

  const sizes = [...new Set(product.variations.map(v => v.size))];
  const colors = [...new Set(product.variations.map(v => v.color))];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
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
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          <div className="md:w-1/2">
            <div className="border border-black mb-4 overflow-hidden relative">
              <img 
                src={product.images[currentImageIndex]?.secure_url} 
                alt={product.name} 
                className="w-full h-[700px] object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-4">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="bg-white text-black border border-black w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="bg-white text-black border border-black w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-24 border ${currentImageIndex === idx ? 'border-black' : 'border-transparent'} hover:border-black transition-colors`}
                >
                  <img src={img.secure_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">{product.name}</h1>
            <p className="text-2xl mb-8">${(product.basePrice / 100).toFixed(2)}</p>
            <p className="text-lg leading-relaxed mb-10">{product.description}</p>
            
            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-3">Color</label>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 border border-black uppercase tracking-widest text-sm transition-colors ${selectedColor === color ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-3">Size</label>
                <div className="flex gap-3">
                  {sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 border border-black uppercase tracking-widest text-sm transition-colors ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-5 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors text-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
