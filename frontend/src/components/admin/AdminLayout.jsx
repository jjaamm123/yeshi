import { Link, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-64 border-r border-black p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 tracking-tighter uppercase">Admin</h1>
        <nav className="flex-1 space-y-4">
          <Link to="/admin/products" className="block text-black hover:invert bg-white px-4 py-2 border border-transparent hover:border-black transition-colors">Products</Link>
          <Link to="/admin/orders" className="block text-black hover:invert bg-white px-4 py-2 border border-transparent hover:border-black transition-colors">Orders</Link>
          <Link to="/admin/inbox" className="block text-black hover:invert bg-white px-4 py-2 border border-transparent hover:border-black transition-colors">Inbox</Link>
        </nav>
        <button onClick={handleLogout} className="mt-auto border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
          Logout
        </button>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
