import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@yeshi.com' && password === 'admin') {
      localStorage.setItem('adminToken', 'dummy-jwt-token');
      navigate('/admin/products');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-black p-8">
        <h1 className="text-3xl font-bold mb-8 tracking-tighter uppercase text-center">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
