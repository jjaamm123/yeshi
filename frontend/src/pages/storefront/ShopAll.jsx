import { useState, useEffect, useMemo } from 'react';
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

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  
  // Sort State
  const [sortBy, setSortBy] = useState('Newest');

  // Accordion States for UI
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    subCategory: true,
    size: true,
    color: true
  });

  const toggleAccordion = (section) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const fetchedProducts = res.data.products || res.data;
        // Assume backend returns array of active products
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dynamic Options Extraction
  const availableCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  const availableSubCategories = useMemo(() => {
    return [...new Set(products.map(p => p.subCategory).filter(Boolean))];
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach(p => {
      if (p.variations) {
        p.variations.forEach(v => {
          if (v.size) sizes.add(v.size);
        });
      }
    });
    return [...sizes];
  }, [products]);

  const availableColors = useMemo(() => {
    const colors = new Set();
    products.forEach(p => {
      if (p.variations) {
        p.variations.forEach(v => {
          if (v.color) colors.add(v.color);
        });
      }
    });
    return [...colors];
  }, [products]);

  // Handle Checkbox Toggles
  const handleToggle = (stateSetter, value) => {
    stateSetter(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedSubCategories.length > 0) {
      result = result.filter(p => selectedSubCategories.includes(p.subCategory));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.variations && p.variations.some(v => selectedSizes.includes(v.size)));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => p.variations && p.variations.some(v => selectedColors.includes(v.color)));
    }

    // Sort
    result = [...result];
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'Newest') {
      // Assuming sorting by _id or createdAt fallback
      result.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
    }

    return result;
  }, [products, selectedCategories, selectedSubCategories, selectedSizes, selectedColors, sortBy]);

  // Render Checkbox List Helper
  const renderFilterList = (options, selectedState, stateSetter) => {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {options.map(option => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedState.includes(option) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500'}`}>
               {selectedState.includes(option) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={selectedState.includes(option)} 
              onChange={() => handleToggle(stateSetter, option)} 
            />
            <span className="text-xs tracking-widest text-gray-600 uppercase">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-[250px] shrink-0">
          <div className="sticky top-28">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-light tracking-widest uppercase text-gray-900">Filters</h2>
              {(selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0) && (
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSubCategories([]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                  }}
                  className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div className="border-b border-gray-200 pb-6">
                  <button onClick={() => toggleAccordion('category')} className="flex justify-between items-center w-full focus:outline-none">
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-900">Category</span>
                    <span className="text-gray-400">{expandedFilters.category ? '-' : '+'}</span>
                  </button>
                  {expandedFilters.category && renderFilterList(availableCategories, selectedCategories, setSelectedCategories)}
                </div>
              )}

              {/* SubCategory Filter */}
              {availableSubCategories.length > 0 && (
                <div className="border-b border-gray-200 pb-6">
                  <button onClick={() => toggleAccordion('subCategory')} className="flex justify-between items-center w-full focus:outline-none">
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-900">Type</span>
                    <span className="text-gray-400">{expandedFilters.subCategory ? '-' : '+'}</span>
                  </button>
                  {expandedFilters.subCategory && renderFilterList(availableSubCategories, selectedSubCategories, setSelectedSubCategories)}
                </div>
              )}

              {/* Size Filter */}
              {availableSizes.length > 0 && (
                <div className="border-b border-gray-200 pb-6">
                  <button onClick={() => toggleAccordion('size')} className="flex justify-between items-center w-full focus:outline-none">
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-900">Size</span>
                    <span className="text-gray-400">{expandedFilters.size ? '-' : '+'}</span>
                  </button>
                  {expandedFilters.size && renderFilterList(availableSizes, selectedSizes, setSelectedSizes)}
                </div>
              )}

              {/* Color Filter */}
              {availableColors.length > 0 && (
                <div className="border-b border-gray-200 pb-6">
                  <button onClick={() => toggleAccordion('color')} className="flex justify-between items-center w-full focus:outline-none">
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-900">Color</span>
                    <span className="text-gray-400">{expandedFilters.color ? '-' : '+'}</span>
                  </button>
                  {expandedFilters.color && renderFilterList(availableColors, selectedColors, setSelectedColors)}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Product Grid Container */}
        <section className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <span className="text-xs tracking-widest text-gray-500 uppercase mb-4 sm:mb-0">
              Showing {filteredAndSortedProducts.length} items
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Sort By:</span>
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-xs uppercase tracking-widest text-gray-900 focus:outline-none cursor-pointer pr-6 border-b border-gray-200 pb-1"
                >
                  <option value="Newest">Newest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-400 pb-1">
                  <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="w-full flex justify-center py-24">
              <span className="text-xs tracking-widest text-gray-400 uppercase animate-pulse">Loading collection...</span>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="w-full flex justify-center py-24 text-center">
              <span className="text-xs tracking-widest text-gray-400 uppercase">No products match your filters.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filteredAndSortedProducts.map(product => {
                const priceToDisplay = product.basePrice ? product.basePrice / 100 : 0;
                const primaryImage = product.images && product.images.length > 0 ? product.images[0].secure_url : 'https://via.placeholder.com/400x500';
                const secondaryImage = product.images && product.images.length > 1 ? product.images[1].secure_url : primaryImage;

                return (
                  <Link key={product._id} to={`/product/${product._id}`} className="group block">
                    <div className="relative border border-gray-100 rounded-lg overflow-hidden mb-4 shadow-sm bg-gray-50 aspect-[3/4]">
                      <img 
                        src={primaryImage} 
                        alt={product.name} 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${product.images?.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                      />
                      {product.images?.length > 1 && (
                        <img 
                          src={secondaryImage} 
                          alt={`${product.name} alternate`} 
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 text-left px-1">
                      <h3 className="text-[11px] font-medium uppercase tracking-widest text-gray-800 line-clamp-1">{product.name}</h3>
                      <p className="text-[11px] tracking-widest text-gray-500">{formatCurrencyNP(priceToDisplay)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default ShopAll;
