import { useState, useEffect } from 'react';
import axios from 'axios';

// Currency formatting utility for NPR
const formatCurrencyNP = (amount) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0
    }).format(amount);
};

const ChevronIcon = () => (
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
    </svg>
);

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // ── Edit state ────────────────────────────────────────────────
    const [editingProductId, setEditingProductId] = useState(null);
    const [existingImages, setExistingImages] = useState([]);

    // ── Form States ───────────────────────────────────────────────
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePriceRs, setBasePriceRs] = useState('');
    const [category, setCategory] = useState('Apparel');
    const [subCategory, setSubCategory] = useState('Tops');
    const [variations, setVariations] = useState([{ size: '', color: '', stockCount: 0 }]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // ── Fetch products on mount ───────────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://yeshi-bg5i.onrender.com/api/products');
                setProducts(res.data.products || res.data || []);
            } catch (error) {
                console.error('Failed to fetch products for admin:', error);
            }
        };
        fetchProducts();
    }, []);

    // ── Reset entire form to blank "create" state ─────────────────
    const resetForm = () => {
        setEditingProductId(null);
        setExistingImages([]);
        setName('');
        setDescription('');
        setBasePriceRs('');
        setCategory('Apparel');
        setSubCategory('Tops');
        setVariations([{ size: '', color: '', stockCount: 0 }]);
        setImages([]);
        setImagePreviews([]);
    };

    const handleCancelClick = () => {
        resetForm();
        setShowForm(false);
    };

    // ── Pre-fill form for editing ─────────────────────────────────
    const handleEditClick = (product) => {
        setEditingProductId(product._id);

        // Pre-fill text fields
        setName(product.name || '');
        setDescription(product.description || '');
        // Convert Paisa → Rupees for the input field
        setBasePriceRs(product.basePrice ? (product.basePrice / 100).toString() : '');
        setCategory(product.category || 'Apparel');
        setSubCategory(product.subCategory || 'Tops');
        setVariations(
            product.variations?.length > 0
                ? product.variations.map(v => ({ size: v.size || '', color: v.color || '', stockCount: v.stockCount || 0 }))
                : [{ size: '', color: '', stockCount: 0 }]
        );

        // Pre-fill image state: keep existing Cloudinary images, clear File objects
        setExistingImages(product.images || []);
        setImagePreviews((product.images || []).map(img => img.secure_url));
        setImages([]);

        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Category / SubCategory sync ───────────────────────────────
    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        if (newCategory === 'Apparel') {
            setSubCategory('Tops');
        } else if (newCategory === 'Shoes') {
            setSubCategory('Sneakers');
        }
    };

    // ── Image file selection ──────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert('You can only upload a maximum of 5 images.');
            return;
        }
        setImages(files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    // ── Variation helpers ─────────────────────────────────────────
    const handleVariationChange = (index, field, value) => {
        const updated = [...variations];
        updated[index][field] = value;
        setVariations(updated);
    };

    const addVariation = () => {
        setVariations([...variations, { size: '', color: '', stockCount: 0 }]);
    };

    const removeVariation = (index) => {
        if (variations.length > 1) {
            setVariations(variations.filter((_, i) => i !== index));
        } else {
            alert('Product must have at least one variation.');
        }
    };

    // ── Smart submit: Create OR Update ───────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (variations.length === 0) {
            alert('Product must have at least one variation.');
            return;
        }

        // Only enforce image requirement when creating a brand-new product
        if (!editingProductId && images.length === 0) {
            alert('Please select at least 1 image.');
            return;
        }
        if (images.length > 5) {
            alert('You can upload a maximum of 5 images.');
            return;
        }

        setLoading(true);

        try {
            // ── Image Logic ────────────────────────────────────────
            let finalImages;

            if (images.length > 0) {
                // User selected new files → upload them
                const formData = new FormData();
                images.forEach(img => formData.append('images', img));
                // Axios Boundary Fix: no Content-Type header — browser sets it with boundary
                const uploadRes = await axios.post('https://yeshi-bg5i.onrender.com/api/admin/images/upload', formData);
                finalImages = uploadRes.data.images || [];
            } else {
                // No new files selected → preserve the existing Cloudinary images
                finalImages = existingImages;
            }

            // ── Shared payload fields ──────────────────────────────
            // Mongoose Enum Fix: force size to uppercase + trim
            const formattedVariations = variations.map(v => ({
                ...v,
                size: v.size.toUpperCase().trim()
            }));

            // Khalti Fix: store price as Paisa (multiply by 100)
            const priceInPaisa = Math.round(parseFloat(basePriceRs) * 100);

            const productPayload = {
                name,
                description,
                basePrice: priceInPaisa,
                category,
                subCategory,
                variations: formattedVariations,
                images: finalImages,
                isActive: true
            };

            // ── Create vs. Update ──────────────────────────────────
            if (editingProductId) {
                // UPDATE: PUT to existing product
                const res = await axios.put(
                    `https://yeshi-bg5i.onrender.com/api/products/${editingProductId}`,
                    productPayload
                );
                const updatedProduct = res.data;
                // Replace the product in the local list
                setProducts(prev =>
                    prev.map(p => (p._id === editingProductId ? updatedProduct : p))
                );
                alert('Product updated successfully!');
            } else {
                // CREATE: POST new product
                const res = await axios.post('https://yeshi-bg5i.onrender.com/api/products', productPayload);
                const savedProduct = res.data?.product || res.data || { id: Date.now(), ...productPayload };
                setProducts(prev => [savedProduct, ...prev]);
                alert('Product created successfully!');
            }

            resetForm();
            setShowForm(false);

        } catch (error) {
            console.error('Submission error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            alert(`Failed to save product: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const isEditing = Boolean(editingProductId);

    // ── Shared select class ───────────────────────────────────────
    const selectCls = 'w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 bg-white text-gray-800 cursor-pointer appearance-none transition-colors';
    const inputCls  = 'w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 bg-white text-gray-800 transition-colors';

    return (
        <div className="max-w-6xl mx-auto p-10">
            {/* ── Header bar ─────────────────────────────────────── */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-light uppercase tracking-widest text-gray-900">
                    Inventory Management
                </h2>
                <button
                    onClick={() => {
                        if (showForm) {
                            handleCancelClick();
                        } else {
                            resetForm();
                            setShowForm(true);
                        }
                    }}
                    className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-2 rounded-md uppercase text-xs font-medium tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
                >
                    {showForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {/* ── Create / Edit Form ──────────────────────────────── */}
            {showForm && (
                <div className="mb-12 bg-white shadow-sm rounded-lg border border-gray-100 p-8 md:p-10">
                    {/* Dynamic form header */}
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-xl font-light uppercase tracking-widest text-gray-900">
                            {isEditing ? 'Edit Product' : 'Create New Product'}
                        </h3>
                        {isEditing && (
                            <span className="text-[10px] uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full">
                                Editing Mode
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputCls}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`${inputCls} h-32`}
                                required
                            />
                        </div>

                        {/* Price / Category / SubCategory */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">
                                    Base Price (Rs.)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={basePriceRs}
                                    onChange={(e) => setBasePriceRs(e.target.value)}
                                    className={inputCls}
                                    placeholder="e.g. 1500"
                                    required
                                />
                                {basePriceRs && (
                                    <p className="text-xs tracking-widest text-gray-400 mt-2 uppercase">
                                        Formatted: {formatCurrencyNP(basePriceRs)}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">
                                    Category
                                </label>
                                <div className="relative">
                                    <select value={category} onChange={handleCategoryChange} className={selectCls} required>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Shoes">Shoes</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <ChevronIcon />
                                    </div>
                                </div>
                            </div>

                            {/* SubCategory */}
                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">
                                    Subcategory
                                </label>
                                <div className="relative">
                                    <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className={selectCls} required>
                                        {category === 'Apparel' ? (
                                            <>
                                                <option value="Tops">Tops</option>
                                                <option value="Bottoms">Bottoms</option>
                                                <option value="Dresses">Dresses</option>
                                                <option value="Innerwear">Innerwear</option>
                                                <option value="Outerwear">Outerwear</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Sneakers">Sneakers</option>
                                                <option value="Flats">Flats</option>
                                                <option value="Heels">Heels</option>
                                                <option value="Boots">Boots</option>
                                            </>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <ChevronIcon />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Variations */}
                        <div className="pt-8 border-t border-gray-100">
                            <h2 className="text-lg uppercase tracking-widest font-medium mb-6 text-gray-800">
                                Variations
                            </h2>

                            {variations.map((variation, index) => (
                                <div key={index} className="grid grid-cols-4 gap-6 mb-6 items-end">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">Size</label>
                                        <input
                                            type="text"
                                            value={variation.size}
                                            onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                                            className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-gray-400 bg-transparent transition-colors"
                                            placeholder="S, M, L, 42"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">Color</label>
                                        <input
                                            type="text"
                                            value={variation.color}
                                            onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                                            className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-gray-400 bg-transparent transition-colors"
                                            placeholder="Black, White"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">Stock</label>
                                        <input
                                            type="number"
                                            value={variation.stockCount}
                                            onChange={(e) => handleVariationChange(index, 'stockCount', Number(e.target.value))}
                                            className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-gray-400 bg-transparent transition-colors"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(index)}
                                            className="w-full bg-white text-gray-600 border border-gray-200 rounded-md py-2 uppercase tracking-widest text-xs cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addVariation}
                                className="mt-2 text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 font-medium cursor-pointer transition-colors"
                            >
                                + Add Another Variation
                            </button>
                        </div>

                        {/* Images */}
                        <div className="pt-8 border-t border-gray-100">
                            <h2 className="text-lg uppercase tracking-widest font-medium mb-6 text-gray-800">
                                Product Images
                            </h2>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-600
                                    file:mr-4 file:py-2 file:px-4
                                    file:border file:border-gray-200 file:rounded-md
                                    file:text-xs file:font-medium file:uppercase file:tracking-widest
                                    file:bg-gray-50 file:text-gray-700 file:cursor-pointer
                                    hover:file:bg-gray-100 file:transition-colors"
                            />

                            <div className="flex flex-col gap-1 mt-3">
                                <p className="text-xs uppercase tracking-widest text-gray-400">
                                    Max 5 images allowed.
                                </p>
                                {isEditing && (
                                    <p className="text-xs uppercase tracking-widest text-amber-500">
                                        {images.length > 0
                                            ? `${images.length} new image(s) selected — will replace existing.`
                                            : 'Leave empty to keep existing images.'}
                                    </p>
                                )}
                            </div>

                            {/* Image previews — shows either existing or newly selected */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative shrink-0">
                                            <img
                                                src={src}
                                                alt={`Preview ${index + 1}`}
                                                className="h-32 w-32 object-cover border border-gray-200 rounded-md shadow-sm"
                                            />
                                            {isEditing && images.length === 0 && (
                                                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] uppercase tracking-wider px-1 rounded">
                                                    Existing
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-gray-700 text-white py-4 rounded-md uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-md"
                        >
                            {loading
                                ? 'Processing...'
                                : isEditing
                                    ? 'Update Product'
                                    : 'Save Product'}
                        </button>
                    </form>
                </div>
            )}

            {/* ── Product Table ───────────────────────────────────── */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                            <th className="py-4 px-6 uppercase tracking-widest text-xs font-medium text-gray-500">Image</th>
                            <th className="py-4 px-6 uppercase tracking-widest text-xs font-medium text-gray-500">Name</th>
                            <th className="py-4 px-6 uppercase tracking-widest text-xs font-medium text-gray-500">Category</th>
                            <th className="py-4 px-6 uppercase tracking-widest text-xs font-medium text-gray-500">Price</th>
                            <th className="py-4 px-6 uppercase tracking-widest text-xs font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-gray-400 uppercase tracking-widest text-xs">
                                    No products found.
                                </td>
                            </tr>
                        )}
                        {products.map((p, idx) => {
                            const priceToDisplay = p.basePrice ? p.basePrice / 100 : 0;
                            const imgUrl = p.images?.length > 0 ? p.images[0].secure_url : '';
                            const isCurrentlyEditing = editingProductId === p._id;

                            return (
                                <tr
                                    key={p._id || p.id || idx}
                                    className={`transition-colors ${isCurrentlyEditing ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                                >
                                    <td className="py-4 px-6">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={p.name} className="w-16 h-16 object-cover border border-gray-200 rounded-md shadow-sm" />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center shadow-sm">
                                                <span className="text-gray-400 text-[10px] uppercase tracking-widest">No Img</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-800 font-medium">{p.name}</td>
                                    <td className="py-4 px-6 text-xs text-gray-500 uppercase tracking-widest">
                                        {p.category} / {p.subCategory}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        {formatCurrencyNP(priceToDisplay)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleEditClick(p)}
                                            className={`text-xs uppercase tracking-widest transition-colors font-medium cursor-pointer ${
                                                isCurrentlyEditing
                                                    ? 'text-amber-600 font-bold'
                                                    : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            {isCurrentlyEditing ? 'Editing…' : 'Edit'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManager;