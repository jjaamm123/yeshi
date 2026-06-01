import { useState } from 'react';
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      let publicId = '';
      
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/admin/images/upload', imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.secure_url;
        publicId = uploadRes.data.public_id;
      }
      
      const newProduct = {
        id: Date.now(),
        ...formData,
        images: [{ secure_url: imageUrl, public_id: publicId }]
      };
      
      setProducts([...products, newProduct]);
      setShowForm(false);
      setFormData({ name: '', description: '', basePrice: '' });
      setImageFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-tighter">Inventory</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-6 py-2 uppercase text-sm tracking-widest hover:bg-white hover:text-black border border-black transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 border border-black p-8 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm mb-2 uppercase tracking-widest">Name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" required />
            </div>
            <div>
              <label className="block text-sm mb-2 uppercase tracking-widest">Base Price (Cents)</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" required />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 uppercase tracking-widest">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-black p-4 focus:outline-none focus:ring-1 focus:ring-black h-32" required />
          </div>
          <div>
            <label className="block text-sm mb-2 uppercase tracking-widest">Product Image</label>
            <input type="file" onChange={handleImageChange} className="w-full p-2 border border-black" required />
          </div>
          <button type="submit" className="bg-black text-white px-8 py-3 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors">
            Save Product
          </button>
        </form>
      )}

      <div className="border-t border-black">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black">
              <th className="py-4 uppercase tracking-widest text-sm font-normal">Image</th>
              <th className="py-4 uppercase tracking-widest text-sm font-normal">Name</th>
              <th className="py-4 uppercase tracking-widest text-sm font-normal">Price</th>
              <th className="py-4 uppercase tracking-widest text-sm font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 uppercase tracking-widest">No products found.</td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="border-b border-black hover:bg-gray-50">
                <td className="py-4">
                  {p.images[0]?.secure_url ? (
                    <img src={p.images[0].secure_url} alt={p.name} className="w-16 h-16 object-cover border border-black" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 border border-black"></div>
                  )}
                </td>
                <td className="py-4">{p.name}</td>
                <td className="py-4">{(p.basePrice / 100).toFixed(2)}</td>
                <td className="py-4">
                  <button className="text-sm underline uppercase tracking-widest hover:opacity-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManager;
